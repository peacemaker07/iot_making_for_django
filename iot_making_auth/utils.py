

def is_token_expired(response_dict):

    message = response_dict.get('message')
    if message == 'token_expired':
        return True

    return False
