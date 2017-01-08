# Clear out whatever version of NVM Travis has.
# Their version of NVM is probably old.
rm -rf ~/.nvm 
# Grab NVM.
git clone https://github.com/creationix/nvm.git ~/.nvm
# Checkout the latest stable tag.
# Note that you can just hardcode a preferred version here.
(cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`)
# This loads nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 
# Install the desired version of Node
nvm install || (. ~/.bashrc && nvm install)
