{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "from flask import Flask\n",
    "from models import *\n",
    "\n",
    "app = Flask(__name__)\n",
    "\n",
    "app.config['SQLALCHEMY_DATABASE_URI']=os.environ.get('DATABASE_URL')\n",
    "app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False\n",
    "\n",
    "db.init_app(app)\n",
    "\n",
    "def main():\n",
    "    db.create_all()\n",
    "\n",
    "if __name__ == \"__main__\":\n",
    "    with app.app_context():\n",
    "        main()"
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
