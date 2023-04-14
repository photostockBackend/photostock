
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
              "description": "The email for pass-recovery is not valid."
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
              "description": "The confirmation-code is not valid."
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
              "description": "The user-profile with the given email already exists."
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
              "description": "The email incorrect or already confirmed."
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
        },
        "put": {
          "operationId": "UserProfileController_updateProfileForCurrentUser",
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
            "400": {
              "description": "The profile for update is not exists."
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
            "profilePhotoLink": {
              "type": "string"
            }
          },
          "required": [
            "username",
            "firstName",
            "lastName",
            "birthday",
            "city",
            "aboutMe",
            "profilePhotoLink"
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
            },
            "avatar": {
              "type": "object",
              "description": "user-profile avatar"
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
