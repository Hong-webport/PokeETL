{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "document.addEventListener('DOMContentLoaded', () => {\n",
    "\n",
    "    // Make sidebar collapse on click\n",
    "    document.querySelector('#show-sidebar-button').onclick = () => {\n",
    "        document.querySelector('#sidebar').classList.toggle('view-sidebar');\n",
    "    };\n",
    "\n",
    "    // Make 'enter' key submit message\n",
    "    let msg = document.getElementById(\"user_message\");\n",
    "    msg.addEventListener(\"keyup\", function(event) {\n",
    "        event.preventDefault();\n",
    "        if (event.keyCode === 13) {\n",
    "            document.getElementById(\"send_message\").click();\n",
    "        }\n",
    "    });\n",
    "});"
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
