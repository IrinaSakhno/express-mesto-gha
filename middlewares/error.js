// eslint-disable-next-line max-classes-per-file
class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class CardNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class WrongFormatError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class IncorrectUserDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class EmptyUserDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class WrongUserDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

const errorHandler = (err, req, res, next) => {
  console.log(JSON.stringify(err));
  let statusCode = 500;
  let message = 'Internal server error has occured';
  if (err instanceof UserNotFound) {
    statusCode = 404;
    message = 'User not found';
  } else if (err instanceof CardNotFound) {
    statusCode = 404;
    message = 'card not found';
  } else if (err instanceof WrongFormatError) {
    statusCode = 400;
    message = 'Wrong ID format';
  } else if (err instanceof IncorrectUserDataError) {
    statusCode = 400;
    message = 'User data is incorrect';
  } else if (err instanceof EmptyUserDataError) {
    statusCode = 403;
    message = 'Please, enter user data';
  } else if (err instanceof WrongUserDataError) {
    statusCode = 401;
    message = 'Wrong user data';
  }

  res.status(statusCode).send({ message });

  next();
};

module.exports = {
  errorHandler,
  UserNotFound,
  WrongFormatError,
  IncorrectUserDataError,
  EmptyUserDataError,
  WrongUserDataError,
};
