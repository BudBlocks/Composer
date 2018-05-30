# Commands to run Rest Server in Cloud

# Add commands for setting up original cloud deploy of the .bna files

# Add commands for upgrading the .bna files

# Commands for pushing the Rest Server to Cloud
First, you should install the IBM Cloud CLI.
The below are from this web [page](ibmcloud dev help)

For Mac and Linux:
```
curl -sL https://ibm.biz/idt-installer | bash
```
For Windows 10: Note: Open Windows PowerShell by right-clicking the PowerShell icon and selecting "Run as Administrator".
```
Set-ExecutionPolicy Unrestricted; iex(New-Object Net.WebClient).DownloadString('http://ibm.biz/idt-win-installer')
```

Verify installation by running the help command
```
ibmcloud dev help
```

Below is from blockchain-starter-kit/.bluemix/pipeline-DEPLOY.sh

```
function deploy_composer_rest_server {
    CONTRACT=$1
    echo deploying rest server for composer contract ${CONTRACT}
    pushd contracts/${CONTRACT}
    BUSINESS_NETWORK_NAME=$(jq --raw-output '.name' package.json)
    BUSINESS_NETWORK_CARD=admin@${BUSINESS_NETWORK_NAME}
    CF_APP_NAME=composer-rest-server-${BUSINESS_NETWORK_NAME}
    cf push \
        ${CF_APP_NAME} \
        --docker-image ibmblockchain/composer-rest-server:${COMPOSER_VERSION} \
        -i 1 \
        -m 256M \
        --no-start \
        --no-manifest
    cf set-env ${CF_APP_NAME} NODE_CONFIG "${NODE_CONFIG}"
    cf set-env ${CF_APP_NAME} COMPOSER_CARD ${BUSINESS_NETWORK_CARD}
    cf set-env ${CF_APP_NAME} COMPOSER_NAMESPACES required
    cf set-env ${CF_APP_NAME} COMPOSER_WEBSOCKETS true
    popd
}
```

1. cd CONTRACTS
