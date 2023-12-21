/* istanbul ignore file */
/* service locator */

const { createContainer } = require('instances-container');

// external tools/agencies
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service: repository, helper, manager, etc.
const UserRepositoryPostgres = require('./repositories/UserRepositoryPostgres');
const AuthRepositoryPostgres = require('./repositories/AuthRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_cases/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthRepository = require('../Domains/authentications/AuthRepository');
const LoginUseCase = require('../Applications/use_cases/LoginUseCase');
const LogoutUseCase = require('../Applications/use_cases/LogoutUseCase');
const RefreshTokenUseCase = require('../Applications/use_cases/RefreshTokenUseCase');
const TokenManager = require('../Applications/security/TokenManager');

// creating container
const container = createContainer();

// registering services & repositories
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: TokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUseCase.name,
    Class: LoginUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
        {
          name: 'tokenManager',
          internal: TokenManager.name,
        },
      ],
    },
  },
  {
    key: LogoutUseCase.name,
    Class: LogoutUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshTokenUseCase.name,
    Class: RefreshTokenUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'tokenManager',
          internal: TokenManager.name,
        },
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
