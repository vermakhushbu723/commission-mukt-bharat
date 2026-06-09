import { env } from '../config/env.js'

// Hand-written OpenAPI 3.0 spec for the community API. Kept in one file so the
// route handlers stay free of doc annotations. Served by swagger-ui at /docs.

const bearer = [{ bearerAuth: [] }]

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CMB Community API',
    version: '0.1.0',
    description:
      'Phone-OTP auth, posts (image/video), threaded comments and likes for the TCJP site. ' +
      '`anonymous` is a per-post/comment flag — the real author is always stored; only the ' +
      'author and admins see through it.',
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: 'local' }],
  tags: [
    { name: 'Auth', description: 'Phone-OTP authentication & profile' },
    { name: 'Media', description: 'S3 presigned uploads' },
    { name: 'Posts', description: 'Articles with image/video, likes' },
    { name: 'Comments', description: 'Threaded comments & likes' },
    { name: 'System' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              code: { type: 'string', nullable: true },
              details: { type: 'object', nullable: true },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          phone: { type: 'string', example: '+919876543210' },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['user', 'admin'] },
          verified: { type: 'boolean' },
          profileComplete: { type: 'boolean' },
        },
      },
      AuthorView: {
        type: 'object',
        description: 'Anonymous posts/comments hide identity from non-author, non-admin viewers.',
        properties: {
          id: { type: 'string', nullable: true },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string', example: 'Anonymous Citizen' },
          avatarUrl: { type: 'string', nullable: true },
          anonymous: { type: 'boolean' },
        },
      },
      Media: {
        type: 'object',
        required: ['type', 'key', 'url'],
        properties: {
          type: { type: 'string', enum: ['image', 'video'] },
          key: { type: 'string', description: 'S3 object key' },
          url: { type: 'string', format: 'uri' },
          thumbnailUrl: { type: 'string', format: 'uri', nullable: true },
          width: { type: 'number', nullable: true },
          height: { type: 'number', nullable: true },
          duration: { type: 'number', nullable: true, description: 'seconds (video)' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          author: { $ref: '#/components/schemas/AuthorView' },
          title: { type: 'string' },
          body: { type: 'string' },
          media: { type: 'array', items: { $ref: '#/components/schemas/Media' } },
          likeCount: { type: 'integer' },
          commentCount: { type: 'integer' },
          liked: { type: 'boolean' },
          isOwner: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          postId: { type: 'string' },
          parentId: { type: 'string', nullable: true },
          depth: { type: 'integer' },
          author: { $ref: '#/components/schemas/AuthorView' },
          body: { type: 'string' },
          likeCount: { type: 'integer' },
          liked: { type: 'boolean' },
          isOwner: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          isNewUser: { type: 'boolean' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing/invalid access token',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: 'Resource not found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Validation: {
        description: 'Validation failed',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      RateLimited: {
        description: 'Too many requests',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: { 200: { description: 'OK' } },
      },
    },

    '/auth/otp/request': {
      post: {
        tags: ['Auth'],
        summary: 'Request an OTP',
        description: 'Sends a 6-digit OTP via SMS. In dev (`SMS_PROVIDER=console`) the code is always `123456` and logged to stdout.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: { phone: { type: 'string', example: '+919876543210' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { ok: { type: 'boolean' }, ttl: { type: 'integer', example: 300 } },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/Validation' },
          429: { $ref: '#/components/responses/RateLimited' },
        },
      },
    },
    '/auth/otp/verify': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP & sign in',
        description: 'First successful verify creates the account (`isNewUser:true`).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'code'],
                properties: {
                  phone: { type: 'string', example: '+919876543210' },
                  code: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } },
          },
          400: { $ref: '#/components/responses/Validation' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/profile': {
      post: {
        tags: ['Auth'],
        summary: 'Complete / update profile',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'displayName'],
                properties: {
                  username: { type: 'string', example: 'citizen_42' },
                  displayName: { type: 'string', example: 'Citizen 42' },
                  avatarUrl: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { description: 'Username taken', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'New token pair',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Revoke a refresh token',
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { refreshToken: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current user',
        security: bearer,
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    '/media/presign': {
      post: {
        tags: ['Media'],
        summary: 'Presign an S3 upload',
        description: 'Returns a presigned PUT URL. Client uploads bytes directly to S3 with the same Content-Type, then includes `{type,key,url}` in the post media. Images ≤8 MB, video ≤100 MB.',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'contentType', 'size'],
                properties: {
                  type: { type: 'string', enum: ['image', 'video'] },
                  contentType: { type: 'string', example: 'image/jpeg' },
                  size: { type: 'integer', example: 524288 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Presigned URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    uploadUrl: { type: 'string', format: 'uri' },
                    key: { type: 'string' },
                    url: { type: 'string', format: 'uri' },
                    type: { type: 'string', enum: ['image', 'video'] },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/Validation' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Feed (cursor-paginated)',
        parameters: [
          { name: 'cursor', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'createdAt of last seen post' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 30, default: 10 } },
        ],
        responses: {
          200: {
            description: 'Posts page',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                    nextCursor: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Create a post',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'body'],
                properties: {
                  title: { type: 'string', minLength: 3, maxLength: 200 },
                  body: { type: 'string', minLength: 5, maxLength: 10000 },
                  media: { type: 'array', maxItems: 4, items: { $ref: '#/components/schemas/Media' } },
                  anonymous: { type: 'boolean', default: false },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { post: { $ref: '#/components/schemas/Post' } } },
              },
            },
          },
          400: { $ref: '#/components/responses/Validation' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/posts/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Posts'],
        summary: 'Get a post',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { post: { $ref: '#/components/schemas/Post' } } },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Posts'],
        summary: 'Edit a post (owner/admin)',
        security: bearer,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  body: { type: 'string' },
                  anonymous: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { post: { $ref: '#/components/schemas/Post' } } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Not your post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Soft-delete a post (owner/admin)',
        security: bearer,
        responses: {
          200: { description: 'OK' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Not your post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/posts/{id}/like': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      post: {
        tags: ['Posts'],
        summary: 'Like a post',
        security: bearer,
        responses: { 200: { description: 'Liked', content: { 'application/json': { schema: { type: 'object', properties: { liked: { type: 'boolean' }, likeCount: { type: 'integer' } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Unlike a post',
        security: bearer,
        responses: { 200: { description: 'Unliked', content: { 'application/json': { schema: { type: 'object', properties: { liked: { type: 'boolean' }, likeCount: { type: 'integer' } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/posts/{id}/comments': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Comments'],
        summary: 'List comments (flat; client rebuilds tree)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { comments: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      post: {
        tags: ['Comments'],
        summary: 'Add a comment / reply (depth ≤3)',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['body'],
                properties: {
                  body: { type: 'string', minLength: 2, maxLength: 4000 },
                  parentId: { type: 'string', description: 'omit for a top-level comment' },
                  anonymous: { type: 'boolean', default: false },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { comment: { $ref: '#/components/schemas/Comment' } } },
              },
            },
          },
          400: { $ref: '#/components/responses/Validation' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/comments/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      delete: {
        tags: ['Comments'],
        summary: 'Soft-delete a comment (owner/admin)',
        security: bearer,
        responses: {
          200: { description: 'OK' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Not your comment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/comments/{id}/like': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      post: {
        tags: ['Comments'],
        summary: 'Like a comment',
        security: bearer,
        responses: { 200: { description: 'Liked', content: { 'application/json': { schema: { type: 'object', properties: { liked: { type: 'boolean' }, likeCount: { type: 'integer' } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
      delete: {
        tags: ['Comments'],
        summary: 'Unlike a comment',
        security: bearer,
        responses: { 200: { description: 'Unliked', content: { 'application/json': { schema: { type: 'object', properties: { liked: { type: 'boolean' }, likeCount: { type: 'integer' } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
  },
}
