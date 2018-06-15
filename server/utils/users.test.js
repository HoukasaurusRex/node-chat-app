const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  const users = new Users();
  beforeEach(() => {
    users.users = [{
      id: '1',
      name: 'JT',
      room: 'Extreme Knitting',
    }, {
      id: '2',
      name: 'Nicole',
      room: 'Steel Boiling',
    }, {
      id: '3',
      name: 'Podrick',
      room: 'Extreme Knitting',
    }];
  });

  it('should add new user', () => {
    const user = {
      id: '123',
      name: 'JT',
      room: 'Extreme Knitting',
    }
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toContainEqual(user);
  });
  it('should remove user', () => {
    const userId = '3'
    const user = users.removeUser(userId);
    expect(user.id).toEqual(userId);
    expect(users.users.length).toBe(2);
  });
  it('should not remove user', () => {
    const user = users.removeUser('4');
    expect(user).toBeFalsy;
    expect(users.users.length).toBe(3);
  });
  it('should find user', () => {
    const user = users.getUser('2');
    expect(user).toEqual(users.users[1]);
  });
  it('should not find user', () => {
    const user = users.getUser('4');
    expect(user).toBeFalsy;
  });
  it('should return names for Extreme Knitting', () => {
    const userList = users.getUserList('Extreme Knitting');
    expect(userList).toEqual(['JT', 'Podrick']);
  });
  it('should return names for Steel Boiling', () => {
    const userList = users.getUserList('Steel Boiling');
    expect(userList).toEqual(['Nicole']);
  });
});
