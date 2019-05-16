import boto3
import os

client = boto3.client('ses', region_name="eu-west-1")
sender = os.environ['SENDER_EMAIL']
subject = os.environ['EMAIL_SUBJECT']
configset = os.environ['CONFIG_SET']
charset = 'UTF-8'


def sendMail(event, context):
    data = event['body']
    content = 'Message from ' + data['name'] + ',\n Email: ' + data[
        'email'] + ',\n Message Contents: ' + data['message']
    response = sendMailToUser(data, content)

    return response


def sendMailToUser(data, content):
    return client.send_email(
        Source=sender,
        Destination={
            'ToAddresses': [
                sender,
            ],
        },
        Message={
            'Subject': {
                'Charset': charset,
                'Data': subject
            },
            'Body': {
                'Html': {
                    'Charset': charset,
                    'Data': content
                },
                'Text': {
                    'Charset': charset,
                    'Data': content
                }
            }
        }
    )
