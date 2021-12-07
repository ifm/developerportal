REPOSRC=$1
REPOBRANCH=$2
LOCALREPO=$3

# We do it this way so that we can abstract if from just git later on
LOCALREPO_VC_DIR=$LOCALREPO/.git

if [ ! -d $LOCALREPO_VC_DIR ]
then
git clone -b $REPOBRANCH $REPOSRC $LOCALREPO
else
cd $LOCALREPO
git checkout $REPOBRANCH
git pull $REPOSRC
fi