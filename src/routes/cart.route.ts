import {Router} from 'express';
import {cartController} from '../controllers';
import attachUser from '../middlewares/attachUser';

const app = Router();


app.get('/', attachUser, cartController.list);

app.get('/:id', attachUser, cartController.description);

// app.post('cart/', attachUser, cartController.add);

export default app;