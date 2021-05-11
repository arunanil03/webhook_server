if [ -z $1 ] || [ -z $2 ]
then
 echo "Arguments not supplied"
else
  echo "Path : $1";
  echo "Process : $2";
  echo " " 
  echo "Starting Deployment"
  echo " " 
  cd $1
  #git stash
  echo "Fetching new changes..."
  git pull 
  npm i --silent
  echo " " 
  echo "Restarting The Process"
  pm2 restart $2
  exit
fi 


