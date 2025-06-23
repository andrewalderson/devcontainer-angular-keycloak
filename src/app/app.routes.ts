import { Route } from '@angular/router';
import { createAuthGuard } from 'keycloak-angular';

export const appRoutes: Route[] = [
    {
        path: '',
        canActivate: [createAuthGuard(async (route, state, authData) => {
            const { authenticated, keycloak } = authData;
            if (!authenticated) {
                keycloak.login();
                return false;
            }
            return true;
        })],
        loadComponent: async () => (await import('./nx-welcome')).NxWelcome,
    },
];
