import {
    AutoRefreshTokenService,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    provideKeycloak,
    UserActivityService,
    withAutoRefreshToken
} from 'keycloak-angular';

export const provideKeycloakAngular = () =>
    provideKeycloak({
        config: {
            realm: 'dev',
            url: 'http://localhost:8080',
            clientId: 'angular'
        },
        initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            redirectUri: window.location.origin + '/'
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: 'logout',
                sessionTimeout: 1000
            })
        ],
        providers: [
            AutoRefreshTokenService,
            UserActivityService,
            {
                provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                useValue: [
                    {
                        urlPattern: /^https:\/\/api\.myapp\.com\/.*$/,
                        httpMethods: ['GET', 'POST'] // Token added only for GET and POST
                    }
                ]
            }
        ]
    });