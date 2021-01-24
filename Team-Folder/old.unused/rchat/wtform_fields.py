{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "from flask_wtf import FlaskForm\n",
    "from wtforms import StringField, PasswordField, SubmitField\n",
    "from wtforms.validators import InputRequired, Length, EqualTo, ValidationError\n",
    "\n",
    "from passlib.hash import pbkdf2_sha256\n",
    "from models import User\n",
    "\n",
    "\n",
    "def invalid_credentials(form, field):\n",
    "    \"\"\" Username and password checker \"\"\"\n",
    "\n",
    "    password = field.data\n",
    "    username = form.username.data\n",
    "\n",
    "    # Check username is invalid\n",
    "    user_data = User.query.filter_by(username=username).first()\n",
    "    if user_data is None:\n",
    "        raise ValidationError(\"Username or password is incorrect\")\n",
    "\n",
    "    # Check password in invalid\n",
    "    elif not pbkdf2_sha256.verify(password, user_data.hashed_pswd):\n",
    "        raise ValidationError(\"Username or password is incorrect\")\n",
    "\n",
    "\n",
    "class RegistrationForm(FlaskForm):\n",
    "    \"\"\" Registration form\"\"\"\n",
    "\n",
    "    username = StringField('username', validators=[InputRequired(message=\"Username required\"), Length(min=4, max=25, message=\"Username must be between 4 and 25 characters\")])\n",
    "    password = PasswordField('password', validators=[InputRequired(message=\"Password required\"), Length(min=4, max=25, message=\"Password must be between 4 and 25 characters\")])\n",
    "    confirm_pswd = PasswordField('confirm_pswd', validators=[InputRequired(message=\"Password required\"), EqualTo('password', message=\"Passwords must match\")])\n",
    "\n",
    "    def validate_username(self, username):\n",
    "        user_object = User.query.filter_by(username=username.data).first()\n",
    "        if user_object:\n",
    "            raise ValidationError(\"Username already exists. Select a different username.\")\n",
    "\n",
    "class LoginForm(FlaskForm):\n",
    "    \"\"\" Login form \"\"\"\n",
    "\n",
    "    username = StringField('username', validators=[InputRequired(message=\"Username required\")])\n",
    "    password = PasswordField('password', validators=[InputRequired(message=\"Password required\"), invalid_credentials])"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.7.6"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
