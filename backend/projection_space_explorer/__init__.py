from flask import Flask
from .projection_space_explorer import pse_api


def create_app():
    app = Flask(__name__)
    app.register_blueprint(pse_api)
    return app