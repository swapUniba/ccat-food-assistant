EDAMAM_CREDENTIALS = [
    {'app_id': '533fdfbf', 'app_key': 'fd3fe51fed2d1530b4c16cf67f163b3f','user': 'rewic93825atexoulardotcom'},
    {'app_id': 'a3b86044', 'app_key': '2a6c03a938f87a4d051fd4c7e8e251d6','user': 'rewic93825atexoulardotcom'},
]

app_index = 0

def get_edamam_credentials():
    global app_index
    credentials = EDAMAM_CREDENTIALS[app_index % len(EDAMAM_CREDENTIALS)]
    app_index = app_index + 1
    return credentials
