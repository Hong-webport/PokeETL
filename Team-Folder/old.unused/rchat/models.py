{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "from flask_sqlalchemy import SQLAlchemy\n",
    "from flask_login import UserMixin\n",
    "\n",
    "db = SQLAlchemy()\n",
    "\n",
    "\n",
    "class User(UserMixin, db.Model):\n",
    "    \"\"\" User model \"\"\"\n",
    "\n",
    "    __tablename__ = \"users\"\n",
    "    id = db.Column(db.Integer, primary_key=True)\n",
    "    username = db.Column(db.String(25), unique=True, nullable=False)\n",
    "    hashed_pswd = db.Column(db.String(), nullable=False)\n"
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
