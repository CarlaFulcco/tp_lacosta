from flask import Flask
from app.views_hoteles import *
from app.database_hoteles import *
from flask_cors import CORS

app = Flask(__name__)

#Rutas
app.route('/', methods=['GET'])(index)

app.route('/api/hoteles/fetch/<int:id_hotel>', methods=['GET'])(get_hotel)
app.route('/api/hoteles/create/', methods=['POST'])(create_hotel)

app.route('/api/hoteles/completed/', methods=['GET'])(get_completed_hoteles)
app.route('/api/hoteles/archived/', methods=['GET'])(get_archived_hoteles)

app.route('/api/hoteles/update/<int:id_hotel>', methods=['PUT'])(update_hotel)
app.route('/api/hoteles/archive/<int:id_hotel>', methods=['DELETE'])(archive_hotel)

#test_conection()
create_table_Hoteles()
init_app(app)
CORS(app)


if __name__ == '__main__':
    app.run(debug=True)