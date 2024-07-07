from app.database_hoteles import get_db

class Hoteles:
    def __init__(self, id_hotel=None, nombre=None, estrellas=None, descripcion=None, mail=None, telefono=None, fecha_creacion=None, activa=None):
        self.id_hotel = id_hotel
        self.nombre = nombre
        self.estrellas= estrellas
        self.descripcion = descripcion
        self.mail=mail
        self.telefono=telefono
        self.fecha_creacion = fecha_creacion
        self.activa = activa

    @staticmethod
    def __get_hoteles_by_query(query):
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
    
        hoteles = []
        for row in rows:
            hoteles.append(
                Hoteles(
                    id_hotel=row[0],
                    nombre=row[1],
                    estrellas=row[2],
                    descripcion=row[3],
                    mail=row[4],
                    telefono=row[5],
                    fecha_creacion=row[6],
                    activa=row[7]
                )
            )
        cursor.close()
        return hoteles

    """@staticmethod
    def get_all_pending():
        return Task.__get_tasks_by_query(
          
                SELECT * 
                FROM tareas 
                WHERE activa = true AND completada = false
                ORDER BY fecha_creacion DESC
            )"""

    @staticmethod
    def get_all_completed():
        return Hoteles.__get_hoteles_by_query(
            """ SELECT * FROM Hoteles WHERE activa = true AND
                ORDER BY fecha_creacion DESC""")

    @staticmethod
    def get_all_archived():
        return Hoteles.__get_hoteles_by_query(
            """ SELECT * FROM hoteles WHERE activa = false
                ORDER BY fecha_creacion DESC""")
    
    @staticmethod
    def get_by_id(id_hotel):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM hoteles WHERE id = %s", (id_hotel,))
        row = cursor.fetchone()
        cursor.close()

        if row:
            return Hoteles(
                id_hotel=row[0],
                    nombre=row[1],
                    estrellas=row[2],
                    descripcion=row[3],
                    mail=row[4],
                    telefono=row[5],
                    fecha_creacion=row[6],
                    activa=row[7]
            )
        return None

    def save(self):
        db = get_db()
        cursor = db.cursor()
        if self.id_hotel:
            cursor.execute(
                """
                    UPDATE hoteles
                    SET nombre = %s, estrellas = %s, descripcion = %s, mail = %s, telefono = %s, activa = %s
                    WHERE id = %s
                """,
                (self.nombre, self.estrellas, self.descripcion, self.mail, self.telefono, self.fecha_creacion, self.activa, self.id_hotel))

        else:
            cursor.execute(
                """
                    INSERT INTO hoteles
                    (nombre, estrellas, descripcion, mail, telefono, fecha_creacion, activa)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (self.nombre, self.estrellas, self.descripcion, self.mail, self.telefono, self.fecha_creacion, self.activa))
            self.id_hotel = cursor.lastrowid
        db.commit()
        cursor.close()

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE hoteles SET activa = false WHERE id = %s", (self.id_hotel,))
        db.commit()
        cursor.close()

    def serialize(self):
        return {
            'id': self.id_hotel,
            'nombre': self.nombre,
            'estrellas': self.estrellas,
            'descripcion': self.descripcion,
            'mail': self.mail,
            'telefono': self.telefono,
            'fecha_creacion': self.fecha_creacion.strftime('%Y-%m-%d'),
            'activa': self.activa
        }