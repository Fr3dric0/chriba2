from authenticator import Authenticator as Auth
from backuphandler import BackupHandler

import sys
import json
import datetime

LIST_PATH = '../bin/config/backup.json'
error_list = []

backup_date = datetime.datetime.now()

def main():
    back_list = []

    # Data to load
    try:
        back_list = findArgs()
    except Exception as e:
        appendError(str(e))
        return saveErrors()

    # Backup the data
    for elem in back_list:
        token = '' # Reset token values

        # If the elem length is over 3
        # authentication is required by server
        # Authenticate based on elem[3] (email) and elem[4] (password)
        # and save token for use in request
        if len(elem) > 3:
            auth_path = elem[2]
            user = elem[3]
            pwd = elem[4]
        
            try:
                token = getToken(auth_path, user, pwd)
            except Exception as e:
                appendError(str(e))
                continue # Jump to next elem, if auth failed
        
        try:
            bhandler = BackupHandler(elem[0], elem[1])
            bhandler.save(token) # Saves the data
        except Exception as e:
            appendError(str(e))

    # Lastly, save potential errors from the backup requests
    saveErrors()


def getToken(path, user, pwd):
    data = Auth(path).authenticate(user, pwd)
    return data['token']


def findArgs():
    """ 
    Checks if the user has provided console arguments,
        if so: Return a list with these data
        else:  Load the default backup list from LIST_PATH
    return: list    List of args
    """
    if len(sys.argv) > 1:
        return [sys.argv[1:]]
    
    return loadBackupList(LIST_PATH)


def loadBackupList(path):
    """
    'path' should store a list of lists
    [
        [
            "<backup file>.json",
            "<url to server>",
            "<optional: path to authentication controller>",
            "<optional: email>",
            "<optional: password>"
        ],
        ...
    ]
    """
    with open(path, 'r') as f:
        data = f.read()
        return json.loads(data)


def appendError(msg):
    """ 
    Appends and error object to the error_list, with the fields
    date: date and time, error: Error message
    """
    date = datetime.datetime.now()
    error_list.append({"date": str(date), "error": msg})


def saveErrors():
    """ 
    Appends all the errors in a .log file, 
    which can be accessed by the user if something in the backup
    process went wrong
    """
    try:
        with open('backup-errors.log', 'a+') as f:
            f.write('/'*30)
            f.write('\n{:^30}'.format('BACKUP'))
            f.write('\n{:^30}'.format(str(backup_date)))
            f.write('\n' + '/'*30 + '\n\n')

            for elem in error_list:
                f.write('Date:\t' + elem['date'] + '\n')
                f.write('Error:\t' +  elem['error'])
                f.write('\n\n')

            f.write('='*20 + '\n\n')
    except Exception as e:
        print('[Backup Critical Error] Could not save error messages')
    
    sys.exit(1)

main()
