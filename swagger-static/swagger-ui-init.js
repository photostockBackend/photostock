
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
      "/delete-all-data": {
        "delete": {
          "operationId": "AllDataController_delete",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "responses": {
            "204": {
              "description": "The user has been successfully registrated."
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
          "responses": {
            "204": {
              "description": "The user has been successfully registrated."
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
                  "$ref": "#/components/schemas/RegistrationEmailInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
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
            }
          },
          "tags": [
            "auth"
          ]
        }
      }
    },
    "info": {
      "title": "Swagger-doc for test-task",
      "description": "The test-task API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "test-task",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
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
            "recoveryCode": {
              "type": "string",
              "description": "code from email"
            }
          },
          "required": [
            "recoveryCode"
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
        "RegistrationEmailInputModel": {
          "type": "object",
          "properties": {}
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
