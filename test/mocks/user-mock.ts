import User from 'src/v1/entities/users/User';
import { Roles } from 'src/v1/interfaces/users/Roles';

const userMock: User[] = [
    new User(1, 'Djingo', 'Test', 'djingo', 'reports', '1234', Roles.USER),
    new User(2, 'Admin', 'Test', 'admin', 'reports', '1234', Roles.ADMIN),
    new User(3, 'Third User', 'Test', 'thirduser', 'reports', '1234', Roles.USER)
];

export default userMock;