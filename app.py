from flask import Flask, send_file, request, jsonify
from flaskext.mysql import MySQL

mysql = MySQL()

app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'moodPass'
app.config['MYSQL_DATABASE_DB'] = 'mood'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

conn = mysql.connect()

@app.route("/")
def index():
    return send_file("templates/index.html")

@app.route('/signin', methods=['POST'])
def Authenticate():
    data = request.json;
    cursor = conn.cursor()
    query = ("SELECT * from users where username=%s and password=%s")
    values = (data['username'], data['password'])
    cursor.execute(query, values)
    data = cursor.fetchone()
    cursor.close()
    if data is None:
        return jsonify(data), 404
    else:
        return jsonify(data), 200

@app.route('/signup', methods=['POST'])
def Create():
    data = request.json
    cursor = conn.cursor()
    query = ("SELECT * from users where username=%s and password=%s")
    values = (data['username'], data['password'])
    cursor.execute(query, values)
    result = cursor.fetchone()
    if result is None:
        query = (
            "INSERT INTO users (username, password) "
            "VALUES (%s, %s)"
        )
        values = (data['username'], data['password'])
        cursor.execute(query, values)
        conn.commit()
        result = cursor.fetchone()
        cursor.close()
        return jsonify(result), 200
    else:
        cursor.close()
        return jsonify(result), 400

@app.route('/getjournal', methods=['GET'])
def getJournal():
    data =  request.args.get('id')
    cursor = conn.cursor()
    query = ("SELECT * from moods_" + data)
    cursor.execute(query)
    conn.commit()
    result = cursor.fetchall()
    cursor.close()
    if result is None:
        return jsonify(result), 404
    else:
        return jsonify(result), 200

@app.route('/newjournal', methods=['POST'])
def Journal():
    data = request.json
    cursor = conn.cursor()
    query = ("CREATE TABLE moods_%s (timestamp VARCHAR(20), mood VARCHAR(20), details TEXT CHARACTER SET utf8)")
    values = (data)
    cursor.execute(query, values)
    conn.commit()
    result = cursor.fetchone()
    cursor.close()
    return jsonify(result), 200

@app.route('/newentry', methods=['POST'])
def Entry():
    data = request.json
    cursor = conn.cursor()
    query = (
        "INSERT INTO moods_%s (timestamp, mood, details) "
        "VALUES (%s, %s, %s)"
        )
    values = (data['id'], data['timestamp'], data['mood'], data['details'])
    cursor.execute(query, values)
    conn.commit()
    result = cursor.fetchone()
    cursor.close()
    return jsonify(result), 200

@app.route('/lastentry', methods=['POST'])
def lastEntry():
    data = request.json
    cursor = conn.cursor()
    query = ("SELECT * from moods_%s")
    values = (data)
    cursor.execute(query, values)
    result = cursor.fetchone()
    cursor.close()
    return jsonify(result), 200

@app.route('/deleteentry', methods=['POST'])
def deleteEntry():
    data = request.json
    cursor = conn.cursor()
    query = ("DELETE FROM moods_%s WHERE timestamp=%s and details=%s")
    values = (data['id'], data['timestamp'], data['details'])
    cursor.execute(query, values)
    result = cursor.fetchone()
    cursor.close()
    return jsonify(result), 200

if __name__ == "__main__":
    app.run()
