import Ember from 'ember';
import fetch from 'fetch';

const { Route, Object } = Ember;

export default Route.extend({
  users: [
    'jrjohnson',
    'thecoolestguy',
    'stopfstedt',
    'saschaben',
    'gboushey',
    'gabycampagna',
    'dartajax',
    'trott',
  ],
  async model(){
    let users = [];
    for (let i = 0; i < this.users.length; i++) {
      const username = this.users[i];
      const repositoryNames = await this.getRepositoriesForUser(username);
      let user = Object.create({
        username,
        repositoryNames
      });
      users.push(user);
    }

    return users;
  },
  async getRepositoriesForUser(name){
    let allNames = [];
    let again = true;
    let page = 1;
    while (again) {
      const names = await this.getAllRepositories(name, page);
      allNames = allNames.concat(names);
      page++;
      again = names.length > 0;
    }

    return allNames.filter(name => name.includes('ember'));
  },
  async getAllRepositories(name, page){
    const url = `https://api.github.com/users/${name}/repos?page=${page}`;
    const response = await fetch(url);
    const json = await response.json();
    const repositoryNames = json.map(data => (data.full_name + data.description + data.owner.login).toLowerCase());

    return repositoryNames;
  }
});
