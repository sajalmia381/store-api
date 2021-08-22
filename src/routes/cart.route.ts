import {Router} from 'express';
import {cartController} from '../controllers';
import attachUser from '../middlewares/attachUser';

const app = Router();


app.get('cart', attachUser, cartController.list);

app.get('cart/:id', attachUser, cartController.description);

// app.post('cart/', attachUser, cartController.add);