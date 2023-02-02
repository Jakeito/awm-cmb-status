from flask import Flask, render_template, request, jsonify
import json
app = Flask(__name__)
from datetime import datetime;

data = []

@app.route("/test/cmb-status")
def table():
    if request.method == 'GET':
        return render_template('table.html')

@app.route("/api/cmb-status", methods=['GET', 'POST'])
def respond():
    if request.method =='GET':
        return jsonify(data)
    elif request.method == 'POST':
        entry = request.json
        entry['time'] = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
        if data == []:
            data.append(entry)
        for i in data:
            if i['macAddress'] == entry['macAddress']:
                if i['status'] != entry['status']:
                    data.remove(i) #Should remove first occurence, meaning latest status update will be retained
                    data.append(entry)
                    return json.dumps(data) #exit since we add an entry
                else:
                    return json.dumps(data) #exit since we don't want to add an entry with same mac address and status
        data.append(entry) #if entry has different mac address, we add to table
        return json.dumps(data)