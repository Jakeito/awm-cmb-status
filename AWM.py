from flask import Flask, render_template, request, jsonify
import json
app = Flask(__name__)
from datetime import datetime;

data = []
filterBackup = []

@app.route("/test/cmb/status")
def table():
    if request.method == 'GET':
        return render_template('table.html')

@app.route("/api/cmb/status", methods=['GET', 'POST'])
def respond():
    global data
    if request.method =='GET':
        return jsonify(data)
    elif request.method == 'POST':
        entry = request.json
        entry['time'] = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
        if 'message' in entry:
            step_string = """
            {{
                "name": "{0}",
                "status": "{1}",
                "time": "{2}",
                "message": "{3}"
            }}
            """.format(entry['step'], entry['status'], entry['time'], entry['message'])
        else:
            step_string = """
            {{
                "name": "{0}",
                "status": "{1}",
                "time": "{2}"
            }}
            """.format(entry['step'], entry['status'], entry['time'])
        entry_string = """
        {{
            "mac-address": "{0}",
            "steps": [
                {1}
            ]
        }}
        """.format(entry['mac-address'], step_string)
        if data == []:
            data.append(json.loads(entry_string))
            return json.dumps(data)
        for i in data:
            if i['mac-address'] == entry['mac-address']:
                for j in i['steps']:
                    if j['name'] == entry['step']:
                        i['steps'].remove(j) #Should remove first occurence, meaning latest status update will be retained
                        i['steps'].append(json.loads(step_string))
                        return json.dumps(data) #exit since we add an entry
                    else: #different step, we should add entry
                        i['steps'].append(json.loads(step_string))
                        return json.dumps(data)
        data.append(json.loads(entry_string)) #if entry has different step or different mac address, we add to table
        return json.dumps(data)

@app.route("/api/cmb/clear", methods=['POST'])
def clear():
    global data
    data = []
    return data

#FILTER WIP
#@app.route("/api/cmb/filter")
#def filter():
#    input = request.args.get('input')
#    global data
#    global filterBackup
#    flag = False
#
#    print(input)
#
#    if input == '':
#        data = filterBackup
#        return data
#
#    for i in filterBackup:
#            if i['mac-address'][-4:].__contains__(input):
#                flag = True
#
#    if flag == True: #If filter yields a result
#        filterBackup = data
#        data = []
#        for i in filterBackup:
#            if i['mac-address'][-4:].__contains__(input):
#                data.append(i)
#    else:
#        data = []
#    return data
    