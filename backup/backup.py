from authenticator import Authenticator
from backuphandler import BackupHandler

import sys

def main(args):
    bhandler = BackupHandler(args[0], args[1])
    bhandler.save(args[2] if len(args) > 2 else '')

main(sys.argv[1:])
