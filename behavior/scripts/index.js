'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const getAccountType = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().accountType)
    },

  extractInfo() {
      const accountType = client.getFirstEntityWithRole(client.getMessagePart(), 'accountType')

      if (accountType) {
        client.updateConversationState({
          accountType: accountType,
        })

        console.log('User wants the weather in:', accountType.value)
      }
    },

    prompt() {
      // Need to prompt user for city    
      console.log('Need to ask user for city')
      client.done()
    },
  })

  const provideBalance = client.createStep({
    satisfied() {
      return false;
    },

    prompt() {
      // Need to prompt user for city    
      console.log('Need to ask user for city')
      client.done()
    },
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'getBalance',
      hi: [sayHello],
      getBalance: [getAccountType, provideBalance],
    },
  })
}
