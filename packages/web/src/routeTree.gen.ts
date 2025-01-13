/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as CallbackImport } from './routes/callback'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as RegisterWizardImport } from './routes/register/_wizard'
import { Route as AuthenticatedUsersIndexImport } from './routes/_authenticated/users.index'
import { Route as AuthenticatedSettingsIndexImport } from './routes/_authenticated/settings.index'
import { Route as AuthenticatedProductsIndexImport } from './routes/_authenticated/products.index'
import { Route as RegisterWizard2Import } from './routes/register/_wizard.2'
import { Route as RegisterWizard1Import } from './routes/register/_wizard.1'
import { Route as AuthenticatedUsersUserIdImport } from './routes/_authenticated/users.$userId'
import { Route as AuthenticatedSettingsServicesImport } from './routes/_authenticated/settings.services'
import { Route as AuthenticatedSettingsRoomsImport } from './routes/_authenticated/settings.rooms'
import { Route as AuthenticatedSettingsImagesImport } from './routes/_authenticated/settings.images'
import { Route as AuthenticatedSettingsRoomsRoomIdIndexImport } from './routes/_authenticated/settings_/rooms/$roomId.index'
import { Route as AuthenticatedSettingsRoomsRoomIdProductsImport } from './routes/_authenticated/settings_/rooms/$roomId.products'
import { Route as AuthenticatedSettingsRoomsRoomIdCostScriptsImport } from './routes/_authenticated/settings_/rooms/$roomId.cost-scripts'
import { Route as AuthenticatedSettingsRoomsRoomIdConfigurationImport } from './routes/_authenticated/settings_/rooms/$roomId.configuration'
import { Route as AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexImport } from './routes/_authenticated/settings_/rooms/$roomId_.products.$productId.index'

// Create Virtual Routes

const RegisterImport = createFileRoute('/register')()
const AuthenticatedUsersLazyImport = createFileRoute('/_authenticated/users')()
const AuthenticatedSettingsLazyImport = createFileRoute(
  '/_authenticated/settings',
)()
const AuthenticatedProductsLazyImport = createFileRoute(
  '/_authenticated/products',
)()
const AuthenticatedSettingsRoomsRoomIdLazyImport = createFileRoute(
  '/_authenticated/settings_/rooms/$roomId',
)()
const AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyImport =
  createFileRoute(
    '/_authenticated/settings_/rooms/$roomId_/products/$productId',
  )()

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const CallbackRoute = CallbackImport.update({
  id: '/callback',
  path: '/callback',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => RegisterRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedUsersLazyRoute = AuthenticatedUsersLazyImport.update({
  id: '/users',
  path: '/users',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/users.lazy').then((d) => d.Route),
)

const AuthenticatedSettingsLazyRoute = AuthenticatedSettingsLazyImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/settings.lazy').then((d) => d.Route),
)

const AuthenticatedProductsLazyRoute = AuthenticatedProductsLazyImport.update({
  id: '/products',
  path: '/products',
  getParentRoute: () => AuthenticatedRoute,
} as any).lazy(() =>
  import('./routes/_authenticated/products.lazy').then((d) => d.Route),
)

const RegisterWizardRoute = RegisterWizardImport.update({
  id: '/_wizard',
  getParentRoute: () => RegisterRoute,
} as any)

const AuthenticatedUsersIndexRoute = AuthenticatedUsersIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedUsersLazyRoute,
} as any)

const AuthenticatedSettingsIndexRoute = AuthenticatedSettingsIndexImport.update(
  {
    id: '/',
    path: '/',
    getParentRoute: () => AuthenticatedSettingsLazyRoute,
  } as any,
)

const AuthenticatedProductsIndexRoute = AuthenticatedProductsIndexImport.update(
  {
    id: '/',
    path: '/',
    getParentRoute: () => AuthenticatedProductsLazyRoute,
  } as any,
)

const RegisterWizard2Route = RegisterWizard2Import.update({
  id: '/2',
  path: '/2',
  getParentRoute: () => RegisterWizardRoute,
} as any)

const RegisterWizard1Route = RegisterWizard1Import.update({
  id: '/1',
  path: '/1',
  getParentRoute: () => RegisterWizardRoute,
} as any)

const AuthenticatedUsersUserIdRoute = AuthenticatedUsersUserIdImport.update({
  id: '/$userId',
  path: '/$userId',
  getParentRoute: () => AuthenticatedUsersLazyRoute,
} as any)

const AuthenticatedSettingsServicesRoute =
  AuthenticatedSettingsServicesImport.update({
    id: '/services',
    path: '/services',
    getParentRoute: () => AuthenticatedSettingsLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoute = AuthenticatedSettingsRoomsImport.update(
  {
    id: '/rooms',
    path: '/rooms',
    getParentRoute: () => AuthenticatedSettingsLazyRoute,
  } as any,
)

const AuthenticatedSettingsImagesRoute =
  AuthenticatedSettingsImagesImport.update({
    id: '/images',
    path: '/images',
    getParentRoute: () => AuthenticatedSettingsLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoomIdLazyRoute =
  AuthenticatedSettingsRoomsRoomIdLazyImport.update({
    id: '/settings_/rooms/$roomId',
    path: '/settings/rooms/$roomId',
    getParentRoute: () => AuthenticatedRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/settings_/rooms/$roomId.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedSettingsRoomsRoomIdIndexRoute =
  AuthenticatedSettingsRoomsRoomIdIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => AuthenticatedSettingsRoomsRoomIdLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoomIdProductsRoute =
  AuthenticatedSettingsRoomsRoomIdProductsImport.update({
    id: '/products',
    path: '/products',
    getParentRoute: () => AuthenticatedSettingsRoomsRoomIdLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoomIdCostScriptsRoute =
  AuthenticatedSettingsRoomsRoomIdCostScriptsImport.update({
    id: '/cost-scripts',
    path: '/cost-scripts',
    getParentRoute: () => AuthenticatedSettingsRoomsRoomIdLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoomIdConfigurationRoute =
  AuthenticatedSettingsRoomsRoomIdConfigurationImport.update({
    id: '/configuration',
    path: '/configuration',
    getParentRoute: () => AuthenticatedSettingsRoomsRoomIdLazyRoute,
  } as any)

const AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRoute =
  AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyImport.update({
    id: '/settings_/rooms/$roomId_/products/$productId',
    path: '/settings/rooms/$roomId/products/$productId',
    getParentRoute: () => AuthenticatedRoute,
  } as any).lazy(() =>
    import(
      './routes/_authenticated/settings_/rooms/$roomId_.products.$productId.lazy'
    ).then((d) => d.Route),
  )

const AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute =
  AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () =>
      AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/callback': {
      id: '/callback'
      path: '/callback'
      fullPath: '/callback'
      preLoaderRoute: typeof CallbackImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/register/_wizard': {
      id: '/register/_wizard'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterWizardImport
      parentRoute: typeof RegisterRoute
    }
    '/_authenticated/products': {
      id: '/_authenticated/products'
      path: '/products'
      fullPath: '/products'
      preLoaderRoute: typeof AuthenticatedProductsLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/settings': {
      id: '/_authenticated/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthenticatedSettingsLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/users': {
      id: '/_authenticated/users'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof AuthenticatedUsersLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/register/': {
      id: '/register/'
      path: '/'
      fullPath: '/register/'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof RegisterImport
    }
    '/_authenticated/settings/images': {
      id: '/_authenticated/settings/images'
      path: '/images'
      fullPath: '/settings/images'
      preLoaderRoute: typeof AuthenticatedSettingsImagesImport
      parentRoute: typeof AuthenticatedSettingsLazyImport
    }
    '/_authenticated/settings/rooms': {
      id: '/_authenticated/settings/rooms'
      path: '/rooms'
      fullPath: '/settings/rooms'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsImport
      parentRoute: typeof AuthenticatedSettingsLazyImport
    }
    '/_authenticated/settings/services': {
      id: '/_authenticated/settings/services'
      path: '/services'
      fullPath: '/settings/services'
      preLoaderRoute: typeof AuthenticatedSettingsServicesImport
      parentRoute: typeof AuthenticatedSettingsLazyImport
    }
    '/_authenticated/users/$userId': {
      id: '/_authenticated/users/$userId'
      path: '/$userId'
      fullPath: '/users/$userId'
      preLoaderRoute: typeof AuthenticatedUsersUserIdImport
      parentRoute: typeof AuthenticatedUsersLazyImport
    }
    '/register/_wizard/1': {
      id: '/register/_wizard/1'
      path: '/1'
      fullPath: '/register/1'
      preLoaderRoute: typeof RegisterWizard1Import
      parentRoute: typeof RegisterWizardImport
    }
    '/register/_wizard/2': {
      id: '/register/_wizard/2'
      path: '/2'
      fullPath: '/register/2'
      preLoaderRoute: typeof RegisterWizard2Import
      parentRoute: typeof RegisterWizardImport
    }
    '/_authenticated/products/': {
      id: '/_authenticated/products/'
      path: '/'
      fullPath: '/products/'
      preLoaderRoute: typeof AuthenticatedProductsIndexImport
      parentRoute: typeof AuthenticatedProductsLazyImport
    }
    '/_authenticated/settings/': {
      id: '/_authenticated/settings/'
      path: '/'
      fullPath: '/settings/'
      preLoaderRoute: typeof AuthenticatedSettingsIndexImport
      parentRoute: typeof AuthenticatedSettingsLazyImport
    }
    '/_authenticated/users/': {
      id: '/_authenticated/users/'
      path: '/'
      fullPath: '/users/'
      preLoaderRoute: typeof AuthenticatedUsersIndexImport
      parentRoute: typeof AuthenticatedUsersLazyImport
    }
    '/_authenticated/settings_/rooms/$roomId': {
      id: '/_authenticated/settings_/rooms/$roomId'
      path: '/settings/rooms/$roomId'
      fullPath: '/settings/rooms/$roomId'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/settings_/rooms/$roomId/configuration': {
      id: '/_authenticated/settings_/rooms/$roomId/configuration'
      path: '/configuration'
      fullPath: '/settings/rooms/$roomId/configuration'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdConfigurationImport
      parentRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyImport
    }
    '/_authenticated/settings_/rooms/$roomId/cost-scripts': {
      id: '/_authenticated/settings_/rooms/$roomId/cost-scripts'
      path: '/cost-scripts'
      fullPath: '/settings/rooms/$roomId/cost-scripts'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdCostScriptsImport
      parentRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyImport
    }
    '/_authenticated/settings_/rooms/$roomId/products': {
      id: '/_authenticated/settings_/rooms/$roomId/products'
      path: '/products'
      fullPath: '/settings/rooms/$roomId/products'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsImport
      parentRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyImport
    }
    '/_authenticated/settings_/rooms/$roomId/': {
      id: '/_authenticated/settings_/rooms/$roomId/'
      path: '/'
      fullPath: '/settings/rooms/$roomId/'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdIndexImport
      parentRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyImport
    }
    '/_authenticated/settings_/rooms/$roomId_/products/$productId': {
      id: '/_authenticated/settings_/rooms/$roomId_/products/$productId'
      path: '/settings/rooms/$roomId/products/$productId'
      fullPath: '/settings/rooms/$roomId/products/$productId'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/settings_/rooms/$roomId_/products/$productId/': {
      id: '/_authenticated/settings_/rooms/$roomId_/products/$productId/'
      path: '/'
      fullPath: '/settings/rooms/$roomId/products/$productId/'
      preLoaderRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexImport
      parentRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedProductsLazyRouteChildren {
  AuthenticatedProductsIndexRoute: typeof AuthenticatedProductsIndexRoute
}

const AuthenticatedProductsLazyRouteChildren: AuthenticatedProductsLazyRouteChildren =
  {
    AuthenticatedProductsIndexRoute: AuthenticatedProductsIndexRoute,
  }

const AuthenticatedProductsLazyRouteWithChildren =
  AuthenticatedProductsLazyRoute._addFileChildren(
    AuthenticatedProductsLazyRouteChildren,
  )

interface AuthenticatedSettingsLazyRouteChildren {
  AuthenticatedSettingsImagesRoute: typeof AuthenticatedSettingsImagesRoute
  AuthenticatedSettingsRoomsRoute: typeof AuthenticatedSettingsRoomsRoute
  AuthenticatedSettingsServicesRoute: typeof AuthenticatedSettingsServicesRoute
  AuthenticatedSettingsIndexRoute: typeof AuthenticatedSettingsIndexRoute
}

const AuthenticatedSettingsLazyRouteChildren: AuthenticatedSettingsLazyRouteChildren =
  {
    AuthenticatedSettingsImagesRoute: AuthenticatedSettingsImagesRoute,
    AuthenticatedSettingsRoomsRoute: AuthenticatedSettingsRoomsRoute,
    AuthenticatedSettingsServicesRoute: AuthenticatedSettingsServicesRoute,
    AuthenticatedSettingsIndexRoute: AuthenticatedSettingsIndexRoute,
  }

const AuthenticatedSettingsLazyRouteWithChildren =
  AuthenticatedSettingsLazyRoute._addFileChildren(
    AuthenticatedSettingsLazyRouteChildren,
  )

interface AuthenticatedUsersLazyRouteChildren {
  AuthenticatedUsersUserIdRoute: typeof AuthenticatedUsersUserIdRoute
  AuthenticatedUsersIndexRoute: typeof AuthenticatedUsersIndexRoute
}

const AuthenticatedUsersLazyRouteChildren: AuthenticatedUsersLazyRouteChildren =
  {
    AuthenticatedUsersUserIdRoute: AuthenticatedUsersUserIdRoute,
    AuthenticatedUsersIndexRoute: AuthenticatedUsersIndexRoute,
  }

const AuthenticatedUsersLazyRouteWithChildren =
  AuthenticatedUsersLazyRoute._addFileChildren(
    AuthenticatedUsersLazyRouteChildren,
  )

interface AuthenticatedSettingsRoomsRoomIdLazyRouteChildren {
  AuthenticatedSettingsRoomsRoomIdConfigurationRoute: typeof AuthenticatedSettingsRoomsRoomIdConfigurationRoute
  AuthenticatedSettingsRoomsRoomIdCostScriptsRoute: typeof AuthenticatedSettingsRoomsRoomIdCostScriptsRoute
  AuthenticatedSettingsRoomsRoomIdProductsRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsRoute
  AuthenticatedSettingsRoomsRoomIdIndexRoute: typeof AuthenticatedSettingsRoomsRoomIdIndexRoute
}

const AuthenticatedSettingsRoomsRoomIdLazyRouteChildren: AuthenticatedSettingsRoomsRoomIdLazyRouteChildren =
  {
    AuthenticatedSettingsRoomsRoomIdConfigurationRoute:
      AuthenticatedSettingsRoomsRoomIdConfigurationRoute,
    AuthenticatedSettingsRoomsRoomIdCostScriptsRoute:
      AuthenticatedSettingsRoomsRoomIdCostScriptsRoute,
    AuthenticatedSettingsRoomsRoomIdProductsRoute:
      AuthenticatedSettingsRoomsRoomIdProductsRoute,
    AuthenticatedSettingsRoomsRoomIdIndexRoute:
      AuthenticatedSettingsRoomsRoomIdIndexRoute,
  }

const AuthenticatedSettingsRoomsRoomIdLazyRouteWithChildren =
  AuthenticatedSettingsRoomsRoomIdLazyRoute._addFileChildren(
    AuthenticatedSettingsRoomsRoomIdLazyRouteChildren,
  )

interface AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteChildren {
  AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute
}

const AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteChildren: AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteChildren =
  {
    AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute:
      AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute,
  }

const AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteWithChildren =
  AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRoute._addFileChildren(
    AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteChildren,
  )

interface AuthenticatedRouteChildren {
  AuthenticatedProductsLazyRoute: typeof AuthenticatedProductsLazyRouteWithChildren
  AuthenticatedSettingsLazyRoute: typeof AuthenticatedSettingsLazyRouteWithChildren
  AuthenticatedUsersLazyRoute: typeof AuthenticatedUsersLazyRouteWithChildren
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedSettingsRoomsRoomIdLazyRoute: typeof AuthenticatedSettingsRoomsRoomIdLazyRouteWithChildren
  AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRoute: typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteWithChildren
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedProductsLazyRoute: AuthenticatedProductsLazyRouteWithChildren,
  AuthenticatedSettingsLazyRoute: AuthenticatedSettingsLazyRouteWithChildren,
  AuthenticatedUsersLazyRoute: AuthenticatedUsersLazyRouteWithChildren,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedSettingsRoomsRoomIdLazyRoute:
    AuthenticatedSettingsRoomsRoomIdLazyRouteWithChildren,
  AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRoute:
    AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteWithChildren,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

interface RegisterWizardRouteChildren {
  RegisterWizard1Route: typeof RegisterWizard1Route
  RegisterWizard2Route: typeof RegisterWizard2Route
}

const RegisterWizardRouteChildren: RegisterWizardRouteChildren = {
  RegisterWizard1Route: RegisterWizard1Route,
  RegisterWizard2Route: RegisterWizard2Route,
}

const RegisterWizardRouteWithChildren = RegisterWizardRoute._addFileChildren(
  RegisterWizardRouteChildren,
)

interface RegisterRouteChildren {
  RegisterWizardRoute: typeof RegisterWizardRouteWithChildren
  RegisterIndexRoute: typeof RegisterIndexRoute
}

const RegisterRouteChildren: RegisterRouteChildren = {
  RegisterWizardRoute: RegisterWizardRouteWithChildren,
  RegisterIndexRoute: RegisterIndexRoute,
}

const RegisterRouteWithChildren = RegisterRoute._addFileChildren(
  RegisterRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedRouteWithChildren
  '/callback': typeof CallbackRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterWizardRouteWithChildren
  '/products': typeof AuthenticatedProductsLazyRouteWithChildren
  '/settings': typeof AuthenticatedSettingsLazyRouteWithChildren
  '/users': typeof AuthenticatedUsersLazyRouteWithChildren
  '/': typeof AuthenticatedIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/settings/images': typeof AuthenticatedSettingsImagesRoute
  '/settings/rooms': typeof AuthenticatedSettingsRoomsRoute
  '/settings/services': typeof AuthenticatedSettingsServicesRoute
  '/users/$userId': typeof AuthenticatedUsersUserIdRoute
  '/register/1': typeof RegisterWizard1Route
  '/register/2': typeof RegisterWizard2Route
  '/products/': typeof AuthenticatedProductsIndexRoute
  '/settings/': typeof AuthenticatedSettingsIndexRoute
  '/users/': typeof AuthenticatedUsersIndexRoute
  '/settings/rooms/$roomId': typeof AuthenticatedSettingsRoomsRoomIdLazyRouteWithChildren
  '/settings/rooms/$roomId/configuration': typeof AuthenticatedSettingsRoomsRoomIdConfigurationRoute
  '/settings/rooms/$roomId/cost-scripts': typeof AuthenticatedSettingsRoomsRoomIdCostScriptsRoute
  '/settings/rooms/$roomId/products': typeof AuthenticatedSettingsRoomsRoomIdProductsRoute
  '/settings/rooms/$roomId/': typeof AuthenticatedSettingsRoomsRoomIdIndexRoute
  '/settings/rooms/$roomId/products/$productId': typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteWithChildren
  '/settings/rooms/$roomId/products/$productId/': typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute
}

export interface FileRoutesByTo {
  '/callback': typeof CallbackRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterIndexRoute
  '/': typeof AuthenticatedIndexRoute
  '/settings/images': typeof AuthenticatedSettingsImagesRoute
  '/settings/rooms': typeof AuthenticatedSettingsRoomsRoute
  '/settings/services': typeof AuthenticatedSettingsServicesRoute
  '/users/$userId': typeof AuthenticatedUsersUserIdRoute
  '/register/1': typeof RegisterWizard1Route
  '/register/2': typeof RegisterWizard2Route
  '/products': typeof AuthenticatedProductsIndexRoute
  '/settings': typeof AuthenticatedSettingsIndexRoute
  '/users': typeof AuthenticatedUsersIndexRoute
  '/settings/rooms/$roomId/configuration': typeof AuthenticatedSettingsRoomsRoomIdConfigurationRoute
  '/settings/rooms/$roomId/cost-scripts': typeof AuthenticatedSettingsRoomsRoomIdCostScriptsRoute
  '/settings/rooms/$roomId/products': typeof AuthenticatedSettingsRoomsRoomIdProductsRoute
  '/settings/rooms/$roomId': typeof AuthenticatedSettingsRoomsRoomIdIndexRoute
  '/settings/rooms/$roomId/products/$productId': typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/callback': typeof CallbackRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRouteWithChildren
  '/register/_wizard': typeof RegisterWizardRouteWithChildren
  '/_authenticated/products': typeof AuthenticatedProductsLazyRouteWithChildren
  '/_authenticated/settings': typeof AuthenticatedSettingsLazyRouteWithChildren
  '/_authenticated/users': typeof AuthenticatedUsersLazyRouteWithChildren
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/_authenticated/settings/images': typeof AuthenticatedSettingsImagesRoute
  '/_authenticated/settings/rooms': typeof AuthenticatedSettingsRoomsRoute
  '/_authenticated/settings/services': typeof AuthenticatedSettingsServicesRoute
  '/_authenticated/users/$userId': typeof AuthenticatedUsersUserIdRoute
  '/register/_wizard/1': typeof RegisterWizard1Route
  '/register/_wizard/2': typeof RegisterWizard2Route
  '/_authenticated/products/': typeof AuthenticatedProductsIndexRoute
  '/_authenticated/settings/': typeof AuthenticatedSettingsIndexRoute
  '/_authenticated/users/': typeof AuthenticatedUsersIndexRoute
  '/_authenticated/settings_/rooms/$roomId': typeof AuthenticatedSettingsRoomsRoomIdLazyRouteWithChildren
  '/_authenticated/settings_/rooms/$roomId/configuration': typeof AuthenticatedSettingsRoomsRoomIdConfigurationRoute
  '/_authenticated/settings_/rooms/$roomId/cost-scripts': typeof AuthenticatedSettingsRoomsRoomIdCostScriptsRoute
  '/_authenticated/settings_/rooms/$roomId/products': typeof AuthenticatedSettingsRoomsRoomIdProductsRoute
  '/_authenticated/settings_/rooms/$roomId/': typeof AuthenticatedSettingsRoomsRoomIdIndexRoute
  '/_authenticated/settings_/rooms/$roomId_/products/$productId': typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdLazyRouteWithChildren
  '/_authenticated/settings_/rooms/$roomId_/products/$productId/': typeof AuthenticatedSettingsRoomsRoomIdProductsProductIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/callback'
    | '/login'
    | '/register'
    | '/products'
    | '/settings'
    | '/users'
    | '/'
    | '/register/'
    | '/settings/images'
    | '/settings/rooms'
    | '/settings/services'
    | '/users/$userId'
    | '/register/1'
    | '/register/2'
    | '/products/'
    | '/settings/'
    | '/users/'
    | '/settings/rooms/$roomId'
    | '/settings/rooms/$roomId/configuration'
    | '/settings/rooms/$roomId/cost-scripts'
    | '/settings/rooms/$roomId/products'
    | '/settings/rooms/$roomId/'
    | '/settings/rooms/$roomId/products/$productId'
    | '/settings/rooms/$roomId/products/$productId/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/callback'
    | '/login'
    | '/register'
    | '/'
    | '/settings/images'
    | '/settings/rooms'
    | '/settings/services'
    | '/users/$userId'
    | '/register/1'
    | '/register/2'
    | '/products'
    | '/settings'
    | '/users'
    | '/settings/rooms/$roomId/configuration'
    | '/settings/rooms/$roomId/cost-scripts'
    | '/settings/rooms/$roomId/products'
    | '/settings/rooms/$roomId'
    | '/settings/rooms/$roomId/products/$productId'
  id:
    | '__root__'
    | '/_authenticated'
    | '/callback'
    | '/login'
    | '/register'
    | '/register/_wizard'
    | '/_authenticated/products'
    | '/_authenticated/settings'
    | '/_authenticated/users'
    | '/_authenticated/'
    | '/register/'
    | '/_authenticated/settings/images'
    | '/_authenticated/settings/rooms'
    | '/_authenticated/settings/services'
    | '/_authenticated/users/$userId'
    | '/register/_wizard/1'
    | '/register/_wizard/2'
    | '/_authenticated/products/'
    | '/_authenticated/settings/'
    | '/_authenticated/users/'
    | '/_authenticated/settings_/rooms/$roomId'
    | '/_authenticated/settings_/rooms/$roomId/configuration'
    | '/_authenticated/settings_/rooms/$roomId/cost-scripts'
    | '/_authenticated/settings_/rooms/$roomId/products'
    | '/_authenticated/settings_/rooms/$roomId/'
    | '/_authenticated/settings_/rooms/$roomId_/products/$productId'
    | '/_authenticated/settings_/rooms/$roomId_/products/$productId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  CallbackRoute: typeof CallbackRoute
  LoginRoute: typeof LoginRoute
  RegisterRoute: typeof RegisterRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  CallbackRoute: CallbackRoute,
  LoginRoute: LoginRoute,
  RegisterRoute: RegisterRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/callback",
        "/login",
        "/register"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/products",
        "/_authenticated/settings",
        "/_authenticated/users",
        "/_authenticated/",
        "/_authenticated/settings_/rooms/$roomId",
        "/_authenticated/settings_/rooms/$roomId_/products/$productId"
      ]
    },
    "/callback": {
      "filePath": "callback.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register",
      "children": [
        "/register/_wizard",
        "/register/"
      ]
    },
    "/register/_wizard": {
      "filePath": "register/_wizard.tsx",
      "parent": "/register",
      "children": [
        "/register/_wizard/1",
        "/register/_wizard/2"
      ]
    },
    "/_authenticated/products": {
      "filePath": "_authenticated/products.lazy.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/products/"
      ]
    },
    "/_authenticated/settings": {
      "filePath": "_authenticated/settings.lazy.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/settings/images",
        "/_authenticated/settings/rooms",
        "/_authenticated/settings/services",
        "/_authenticated/settings/"
      ]
    },
    "/_authenticated/users": {
      "filePath": "_authenticated/users.lazy.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/users/$userId",
        "/_authenticated/users/"
      ]
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/register/": {
      "filePath": "register/index.tsx",
      "parent": "/register"
    },
    "/_authenticated/settings/images": {
      "filePath": "_authenticated/settings.images.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/settings/rooms": {
      "filePath": "_authenticated/settings.rooms.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/settings/services": {
      "filePath": "_authenticated/settings.services.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/users/$userId": {
      "filePath": "_authenticated/users.$userId.tsx",
      "parent": "/_authenticated/users"
    },
    "/register/_wizard/1": {
      "filePath": "register/_wizard.1.tsx",
      "parent": "/register/_wizard"
    },
    "/register/_wizard/2": {
      "filePath": "register/_wizard.2.tsx",
      "parent": "/register/_wizard"
    },
    "/_authenticated/products/": {
      "filePath": "_authenticated/products.index.tsx",
      "parent": "/_authenticated/products"
    },
    "/_authenticated/settings/": {
      "filePath": "_authenticated/settings.index.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/users/": {
      "filePath": "_authenticated/users.index.tsx",
      "parent": "/_authenticated/users"
    },
    "/_authenticated/settings_/rooms/$roomId": {
      "filePath": "_authenticated/settings_/rooms/$roomId.lazy.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/settings_/rooms/$roomId/configuration",
        "/_authenticated/settings_/rooms/$roomId/cost-scripts",
        "/_authenticated/settings_/rooms/$roomId/products",
        "/_authenticated/settings_/rooms/$roomId/"
      ]
    },
    "/_authenticated/settings_/rooms/$roomId/configuration": {
      "filePath": "_authenticated/settings_/rooms/$roomId.configuration.tsx",
      "parent": "/_authenticated/settings_/rooms/$roomId"
    },
    "/_authenticated/settings_/rooms/$roomId/cost-scripts": {
      "filePath": "_authenticated/settings_/rooms/$roomId.cost-scripts.tsx",
      "parent": "/_authenticated/settings_/rooms/$roomId"
    },
    "/_authenticated/settings_/rooms/$roomId/products": {
      "filePath": "_authenticated/settings_/rooms/$roomId.products.tsx",
      "parent": "/_authenticated/settings_/rooms/$roomId"
    },
    "/_authenticated/settings_/rooms/$roomId/": {
      "filePath": "_authenticated/settings_/rooms/$roomId.index.tsx",
      "parent": "/_authenticated/settings_/rooms/$roomId"
    },
    "/_authenticated/settings_/rooms/$roomId_/products/$productId": {
      "filePath": "_authenticated/settings_/rooms/$roomId_.products.$productId.lazy.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/settings_/rooms/$roomId_/products/$productId/"
      ]
    },
    "/_authenticated/settings_/rooms/$roomId_/products/$productId/": {
      "filePath": "_authenticated/settings_/rooms/$roomId_.products.$productId.index.tsx",
      "parent": "/_authenticated/settings_/rooms/$roomId_/products/$productId"
    }
  }
}
ROUTE_MANIFEST_END */
