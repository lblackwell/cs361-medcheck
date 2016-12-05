# cs361-medcheck

Web demo: https://cs361-medcheck.herokuapp.com/

## Instructions For Testing

Please use vagrant to test this project.

1. Download Vagrant from https://vagrantup.com

2. Clone the repository `git clone https://github.com/lblackwell/cs361-medcheck`

3. From the cloned directory, run `vagrant up`

4. After it is finished, run `vagrant ssh`

5. From the VM, run `cd /vagrant && npm install`

6. To start the application, run `npm run dev` or `PGPASSWORD=password npm run dev`

7. Check the application at `http://localhost:3000`

To run unit tests:
- In project directory, run `mocha --recursive`
- Scripts in `scripts/` are run from the project directory using bash.
