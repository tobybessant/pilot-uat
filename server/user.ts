const users = [
  {
    id: 0,
    displayName: "Toby",
    email: "toby@me.com"
  },
  {
    id: 1,
    displayName: "John",
    email: "john@me.com",
    password: "yeet"
  }
];

const identities = [
{
    id: 0,
    userId: 0,
    type: "local",
    validationData: "balls"
  },
  {
    id: 1,
    userId: 0,
    type: "github",
    validationData: "32138988"
  }
]

export { users, identities };