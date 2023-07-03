// eslint-disable-next-line max-classes-per-file
class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UserNotExist extends Error {
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

class IncorrectCardDataError extends Error {
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
    this.statusCode = 400;
  }
}

class UserNotLoggedIn extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class DeleteRightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class UserDoesntExistError extends Error {
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
    statusCode = 401;
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
    statusCode = 400;
    message = 'Wrong user data';
  } else if (err instanceof UserNotLoggedIn) {
    statusCode = 401;
    message = 'You are not logged in';
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    message = 'User with this email already exists';
  } else if (err instanceof IncorrectCardDataError) {
    statusCode = 400;
    message = 'Card data is incorrect';
  } else if (err instanceof DeleteRightsError) {
    statusCode = 403;
    message = 'You can only delete your own cards';
  } else if (err instanceof UserNotExist) {
    statusCode = 403;
    message = 'User does not exist';
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
  UserNotLoggedIn,
  ConflictError,
  IncorrectCardDataError,
  DeleteRightsError,
  UserDoesntExistError,
  CardNotFound,
  UserNotExist,
};
