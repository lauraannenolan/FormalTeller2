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
      return Boolean(client.getConversationState().accounttype)
    },

  extractInfo() {
      const accountType2 = client.getFirstEntityWithRole(client.getMessagePart(), 'accounttype')

      if (accountType2) {
        client.updateConversationState({
          accounttype: accountType2,
        })

        console.log('User wants account type:', accountType2.value)
      }
    },

    prompt() {
      // Need to prompt user for city    
      client.addResponse('prompt/balance')
      client.done()
    },
  })

  const provideBalance = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().balancegiven)
    },

    prompt() {
      let data = {
        amount: 809,
        accounttype: client.getConversationState().accounttype.value,
      }

      client.addResponse('provide_balance/current', data)
       client.updateConversationState({
          balancegiven: true,
        })
      console.log('Need to ask user for city')
      client.done()
    },
    })

    const goodbye = client.createStep({
    satisfied() {
      return false;
    },

    prompt() {

      client.addTextResponse('See ya later')
      console.log('BYE BYE ')
      client.done()
      },
    })


    const provideTransfer = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().accounttype)
    },

    extractInfo() {
      const accountType2 = client.getFirstEntityWithRole(client.getMessagePart(), 'accounttype')

      if (accountType2) {
        client.updateConversationState({
          accounttype: accountType2,
        })

        console.log('User wants account type:', accountType2.value)
      }
    },

    prompt() {
      // Need to prompt user for city    
      client.addResponse('request/transfer')
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
      getBalance: [getAccountType, provideBalance, provideTransfer],
      bye: [goodbye]
    },
  })
}
