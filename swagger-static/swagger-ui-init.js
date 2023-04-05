
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
              "description": "The user has been successfully logined."
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
              "description": "The tokens has been successfully refreshed."
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
              "description": "The user has been successfully registration-confimated."
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
              "description": "The user has been successfully registrated."
            },
            "400": {
              "description": "The user with the given email already exists."
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
              "description": "The user has been successfully registrated."
            },
            "400": {
              "description": "The user has been successfully registrated."
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
              "description": "The user has been successfully logout."
            },
            "401": {
              "description": "The user is not authorized."
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
              "description": "The user has been successfully identified."
            },
            "401": {
              "description": "The user is not authorized."
            }
          },
          "tags": [
            "auth"
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
              "description": "user email"
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
            "email": {
              "type": "string",
              "description": "user email"
            },
            "password": {
              "type": "string",
              "description": "user password"
            }
          },
          "required": [
            "email",
            "password"
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
            "email": {
              "type": "string",
              "description": "user email"
            },
            "password": {
              "type": "string",
              "description": "user password",
              "minLength": 6,
              "maxLength": 20
            }
          },
          "required": [
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
