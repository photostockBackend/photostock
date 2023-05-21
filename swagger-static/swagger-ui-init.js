
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordRecoveryInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The code for pass-recovery sended to email."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The password has been successfully changed."
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginInputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewModelToken"
                  }
                }
              }
            },
            "401": {
              "description": "The email or password is not correct."
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshTokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The tokens has been successfully refreshed. Return access-token in response, and refresh-token in cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewModelToken"
                  }
                }
              }
            },
            "401": {
              "description": "The refresh-token is not valid."
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationConfirmationInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The user-profile has been successfully registration-confimated."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The user-profile has been successfully registrated."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationEmailResendingInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The new-code has been successfully sended."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": "The user-profile has been successfully logout."
            },
            "401": {
              "description": "The user-profile is not authorized."
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getAuthMe",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The user-profile has been successfully identified.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AuthMeViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "The user-profile is not authorized."
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/oauth2/google/login": {
        "get": {
          "operationId": "oAuth2Controller_googleLogin",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Oauth2InputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewModelToken"
                  }
                }
              }
            },
            "400": {
              "description": "Code not transferred."
            },
            "401": {
              "description": "Auth with google not success."
            }
          },
          "tags": [
            "oauth2"
          ]
        }
      },
      "/oauth2/github/login": {
        "get": {
          "operationId": "oAuth2Controller_githubLogin",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Oauth2InputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ViewModelToken"
                  }
                }
              }
            },
            "400": {
              "description": "Code not transferred."
            },
            "401": {
              "description": "Auth with github not success."
            }
          },
          "tags": [
            "oauth2"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityDevicesController_getSessions",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The user-profile has been successfully identified.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/SessionsViewModels"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "The user is not authorized."
            }
          },
          "tags": [
            "devices"
          ]
        },
        "delete": {
          "operationId": "SecurityDevicesController_deleteAllSessionsExcludeCurrent",
          "parameters": [],
          "responses": {
            "204": {
              "description": "All sessions except the current one have been deleted."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "devices"
          ]
        }
      },
      "/security/devices/{id}": {
        "delete": {
          "operationId": "SecurityDevicesController_deleteSessionByDeviceId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Session by deviceId has been deleted."
            },
            "400": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Errored"
                      },
                      {
                        "properties": {
                          "errorMessages": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/ErrorSwagger"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "devices"
          ]
        }
      },
      "/user/profile": {
        "get": {
          "operationId": "UserProfileController_getProfileForCurrentUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The profile get for current user-profile.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProfileUserViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "The user-profile not identified."
            },
            "404": {
              "description": "Profile for current user-profile doesnt exists."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user/profile/info": {
        "put": {
          "operationId": "UserProfileController_updateProfileInfo",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateProfileInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The profile has been successfully updated."
            },
            "401": {
              "description": "The user-profile not identified."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user/profile/photo": {
        "put": {
          "operationId": "UserProfileController_updateProfilePhoto",
          "parameters": [],
          "responses": {
            "204": {
              "description": "The profile photo has been successfully updated."
            },
            "401": {
              "description": "The user-profile not identified."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user/post/{id}": {
        "get": {
          "operationId": "UserProfileController_getPostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The post get by id.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostUserViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Post doesnt exists."
            }
          },
          "tags": [
            "user"
          ]
        },
        "put": {
          "operationId": "UserProfileController_updatePostForCurrentUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/from-data": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePostInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "The post has been successfully updated."
            },
            "400": {
              "description": "Too many photos for one post."
            },
            "401": {
              "description": "The user not identified."
            },
            "404": {
              "description": "The post for update did not found."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "UserProfileController_deletePostForCurrentUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "The post has been successfully deleted."
            },
            "401": {
              "description": "The user not identified."
            },
            "404": {
              "description": "The post for delete did not found."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/user/post": {
        "get": {
          "operationId": "UserProfileController_getPostsByUserId",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "integer",
                "default": 1
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "integer",
                "default": 8
              },
              "description": "pageSize is portions size that should be returned"
            }
          ],
          "responses": {
            "200": {
              "description": "The posts by user.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostsUserWithPaginationViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Posts doesnt exists."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "UserProfileController_createPostForCurrentUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "The post has been successfully created."
            },
            "401": {
              "description": "The user not identified."
            }
          },
          "tags": [
            "user"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/payments/stripe/attachcard": {
        "post": {
          "operationId": "PaymentController_stripeAttachCustomer",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AttachCardInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "The card has been successfully attached"
            }
          },
          "tags": [
            "payments"
          ]
        }
      },
      "/payments/stripe/createsubcription": {
        "post": {
          "operationId": "PaymentController_stripeCreateSubscription",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSubscriptionInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "The subscription has been successfully created"
            }
          },
          "tags": [
            "payments"
          ]
        }
      },
      "/payments/stripe/webhook/subscriptionupdated": {
        "post": {
          "operationId": "PaymentController_stripeWebhookSubscriptionUpdated",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "payments"
          ]
        }
      },
      "/payments/getallpayments": {
        "get": {
          "operationId": "PaymentController_getAllPayments",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The list of payments has been successfully returned"
            }
          },
          "tags": [
            "payments"
          ]
        }
      },
      "/payments/getcurrentsubscription": {
        "get": {
          "operationId": "PaymentController_getCurrentPayment",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The current subscription has been successfully returned"
            }
          },
          "tags": [
            "payments"
          ]
        }
      },
      "/public/post/{postId}": {
        "get": {
          "operationId": "PublicController_getPostByIdWithComments",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The profile get for current user-profile.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostWithNewestCommentsViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Profile for current user-profile doesnt exists."
            }
          },
          "tags": [
            "public"
          ]
        }
      },
      "/public/{postId}/comments": {
        "get": {
          "operationId": "PublicController_getCommentsByPostId",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "type": "integer",
                "default": 1
              },
              "description": "pageNumber is number of portions that should be returned"
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "type": "integer",
                "default": 8
              },
              "description": "pageSize is portions size that should be returned"
            }
          ],
          "responses": {
            "200": {
              "description": "The posts by user.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostsUserWithPaginationViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Posts doesnt exists."
            }
          },
          "tags": [
            "public"
          ]
        },
        "post": {
          "operationId": "PublicController_createCommentByPostId",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "public"
          ]
        }
      },
      "/public/comments/{commentId}": {
        "put": {
          "operationId": "PublicController_updComment",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCommentInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "public"
          ]
        },
        "delete": {
          "operationId": "PublicController_deleteComment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "public"
          ]
        }
      }
    },
    "info": {
      "title": "Swagger-doc for photoStock",
      "description": "The photoStock API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "photoStock",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "Errored": {
          "type": "object",
          "properties": {}
        },
        "ErrorSwagger": {
          "type": "object",
          "properties": {
            "field": {
              "type": "string"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "field",
            "message"
          ]
        },
        "PasswordRecoveryInputModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "user-profile email"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordInputModel": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "new password"
            },
            "recoveryCode": {
              "type": "string",
              "description": "code from email"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "LoginInputModel": {
          "type": "object",
          "properties": {
            "emailOrUsername": {
              "type": "string",
              "description": "user-profile name or user-profile email"
            },
            "password": {
              "type": "string",
              "description": "user-profile password"
            }
          },
          "required": [
            "emailOrUsername",
            "password"
          ]
        },
        "ViewModelToken": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "RegistrationConfirmationInputModel": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "code from email"
            }
          },
          "required": [
            "code"
          ]
        },
        "RegistrationInputModel": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user-profile name"
            },
            "email": {
              "type": "string",
              "description": "user-profile email"
            },
            "password": {
              "type": "string",
              "description": "user-profile password",
              "minLength": 6,
              "maxLength": 20
            }
          },
          "required": [
            "username",
            "email",
            "password"
          ]
        },
        "RegistrationEmailResendingInputModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email for resend confirmation-code"
            }
          },
          "required": [
            "email"
          ]
        },
        "AuthMeViewModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "userId": {
              "type": "number"
            }
          },
          "required": [
            "email",
            "userId"
          ]
        },
        "Oauth2InputModel": {
          "type": "object",
          "properties": {
            "oauth2code": {
              "type": "string",
              "description": "code from oauth2-service"
            }
          },
          "required": [
            "oauth2code"
          ]
        },
        "SessionsViewModels": {
          "type": "object",
          "properties": {
            "ip": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "lastActiveDate": {
              "type": "string"
            },
            "deviceId": {
              "type": "string"
            }
          },
          "required": [
            "ip",
            "title",
            "lastActiveDate",
            "deviceId"
          ]
        },
        "PhotoLinks": {
          "type": "object",
          "properties": {}
        },
        "ProfileUserViewModel": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string"
            },
            "firstName": {
              "type": "string"
            },
            "lastName": {
              "type": "string"
            },
            "birthday": {
              "format": "date-time",
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "aboutMe": {
              "type": "string"
            },
            "avatar": {
              "$ref": "#/components/schemas/PhotoLinks"
            }
          },
          "required": [
            "username",
            "firstName",
            "lastName",
            "birthday",
            "city",
            "aboutMe",
            "avatar"
          ]
        },
        "UpdateProfileInputModel": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "user-profile username"
            },
            "firstName": {
              "type": "string",
              "description": "user-profile name"
            },
            "lastName": {
              "type": "string",
              "description": "user-profile surname"
            },
            "birthday": {
              "format": "date-time",
              "type": "string",
              "description": "user-profile birthday"
            },
            "city": {
              "type": "string",
              "description": "user-profile city"
            },
            "aboutMe": {
              "type": "string",
              "description": "user-profile about"
            }
          },
          "required": [
            "username"
          ]
        },
        "PostUserViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "description": {
              "type": "string"
            },
            "postPhotos": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "id",
            "description",
            "postPhotos"
          ]
        },
        "PostsUserWithPaginationViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "totalCount": {
              "type": "number"
            },
            "posts": {
              "$ref": "#/components/schemas/PostUserViewModel"
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "posts"
          ]
        },
        "CreatePostInputModel": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string"
            },
            "postPhoto": {
              "type": "string",
              "format": "binary"
            }
          },
          "required": [
            "postPhoto"
          ]
        },
        "UpdatePostInputModel": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string"
            },
            "existedPhotos": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "postPhoto": {
              "type": "string",
              "format": "binary"
            }
          },
          "required": [
            "existedPhotos"
          ]
        },
        "AttachCardInputModel": {
          "type": "object",
          "properties": {}
        },
        "CreateSubscriptionInputModel": {
          "type": "object",
          "properties": {}
        },
        "CommentViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "text": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "avatarId": {
              "type": "number"
            }
          },
          "required": [
            "id",
            "text",
            "username",
            "avatarId"
          ]
        },
        "PostWithNewestCommentsViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "description": {
              "type": "string"
            },
            "postPhotos": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "newestComments": {
              "maxItems": 3,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentViewModel"
              }
            }
          },
          "required": [
            "id",
            "description",
            "postPhotos",
            "newestComments"
          ]
        },
        "CreateCommentInputModel": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string"
            }
          },
          "required": [
            "text"
          ]
        },
        "UpdateCommentInputModel": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string"
            }
          },
          "required": [
            "text"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
