import requests

class Authenticator():

    def __init__(self, path):
        self.path = path

    def authenticate(self, user, pwd):
        res = requests.post(self.path, data={'email':user, 'password': pwd})

        if (res.status_code > 399):
            if (res.status_code == 404):
                raise IOError('[Authenticator authenticate] Cannot find resource at path {}'.format(self.path))
            elif (res.status_code == 403 or res.status_code == 401):
                print(res.json())
                raise ValueError('[Authenticator authenticate] Username or password is wrong.\n\turl: {}'.format(self.path))
            elif (res.status_code == 400):
                print(res.json())
                raise ValueError('[Authenticator authenticate] Request body is most likelly malformed')
            else:
                print(res.json())
                raise IOError('[Authenticator authenticate] Uknown server error')
        return res.json()
