import os
from flask import Flask, request, render_template, jsonify
from external.yrno import Yrno
from database.db import Database

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    yrno = Yrno()
    db = Database()

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/', methods=['GET'])
    def index():
        # Render front page template
        return render_template('index.html')

    @app.route('/temps/indoors', methods=['GET', 'POST'])
    def indoor_router():
        # Get data from the database and return to querier
        if request.method == 'POST':
            db.write_data()
            return []
        if request.method == 'GET':
            temperatures = db.query_all()
            return jsonify(temperatures)

    @app.route('/temps/outdoors', methods=['GET'])
    def outdoor_router():
        # Fetch data from external API and return to querier
        yrno.update_yrno()
        temperature = yrno.get_yrno_temps()
        timestamp = yrno.get_yrno_timestamp()
        return { 'temperature': temperature, 'time': timestamp }

    return app
