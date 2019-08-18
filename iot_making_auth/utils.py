

def is_token_expired(response_dict):

    message = response_dict.get('message')

    # TODO
    if not message:
        message = response_dict.get('Message')

    if message == 'token_expired':
        return True

    # TODO
    if message == 'User is not authorized to access this resource with an explicit deny':
        return True

    return False
