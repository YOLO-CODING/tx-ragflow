import logging
import json

if __name__ ==  "__main__":
    logging.basicConfig(level=logging.DEBUG)
    data = {"a": 1, "b": 2, "c": 3}
    print(json.dumps(data))