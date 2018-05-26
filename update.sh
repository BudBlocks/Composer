#!/bin/bash 

#Creates and upgraes the buissness network archive 

##Constants
NETWORK_NAME=
NETWORK_VERSION=
CARD=PeerAdmin@hlfv1

##FUNCTIONS

getName() {
	if [ -f package.json ]; then
                echo $(grep name package.json | cut -d \" -f 4) 
                exit
        else
                echo "package.json does not exist"
                exit 1
        fi
}
getVersion() { #may want to add something to check versions of existing bna files
	if [ -f package.json ]; then
		echo $(grep version package.json | cut -d \" -f 4) 
        
	else
                echo "package.json does not exist"
                exit 1
        fi
} 

checkCard() {
	if [ "composer card list -c $CARD" ]; then
		echo "Card is vaild"
	else 
		echo -n "The default card $CARD does not seem to have been create it. Input a different card? (y/n) "
		read response
		if [ $response != "y" ]; then
			exit 1
		else
			echo -n "Card Name:"
			read response
			CARD = response
		fi
	fi	 
}

upgrade() {
	composer archive create -t dir -n .
	composer network install -c $CARD -a $NETWORK_NAME@$NETWORK_VERSION.bna
	composer network upgrade -c $CARD -n $NETWORK_NAME -V $NETWORK_VERSION
	echo "Sucess"
}


fail() {
  echo fail
}

##Main

NETWORK_VERSION=$(getVersion)
NETWORK_NAME=$(getName)
checkCard
upgrade || fail
