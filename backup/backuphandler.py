import requests
import json

class BackupHandler():
    # param: string name    Name should be the backup name
    def __init__(self, name, path):
        self.name = name
        self.path = path

    def save(self, token):
        res = requests.get(self.path, headers={'Authorization': token})
        try:
            data = self._responseHandler(res)
            self._saveData(data)
        except Exception as e:
            raise e

    def _responseHandler(self, res):
        status = res.status_code

        if (status > 399):
            data = res.json()
            if 'error' in data:
                raise IOError('[Backup Handler] {} \nurl: {}'.format(data['error'], res.url))

            raise IOError('[Backup Handler] Bad request {} '.format(res.url))

        return res.json()

    def _saveData(self, data):
                                                                                                                                                                            with open(self.name, 'w') as f:
                                                                                                                                                                                            f.write(json.dumps(data))
