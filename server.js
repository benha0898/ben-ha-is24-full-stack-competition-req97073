import express, { json } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const router = express.Router();
const PORT = 3000;
const DB = 'db.json';

app.use(bodyParser.json());
app.use('/', router);
app.use((req, res, next)=>{
    handleError(res, 404, 'Not Found');
  });

app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}`));


// Health check
router.get('/', (req, res) => res.json({message: 'The API is running successfully.'}));

// Define all endpoints
router.get('/products', getProducts);
router.post('/products', addProduct);
router.delete('/products/:id', removeProduct);
router.put('/products/:id', editProduct);

// GET products
// Accepts scrumMaster or developer as query string
async function getProducts(req, res) {
    try {
        fs.readFile(DB, (err, data) => {
            if (err) {
                handleError(res, 500, err.message);
            } else {
                let jsonData = JSON.parse(data).products;

                let scrumMaster = req.query.scrumMaster;
                let developer = req.query.developer;

                if (scrumMaster) {
                    jsonData = jsonData.filter((product) => product.scrumMasterName.toLowerCase().includes(scrumMaster.toLowerCase()));
                } else if (developer) {
                    jsonData = jsonData.filter((product) => product.developers.some((name) => name.toLowerCase().includes(developer.toLowerCase())));
                }
                res.json(jsonData);
            }
        });
    } catch (err) {
        handleError(res, 500, err.message);
    }
}

// POST new product
async function addProduct(req, res) {
    try {
        fs.readFile(DB, (err, data) => {
            if (err) {
                handleError(res, 500, err.message);
            } else {
                let jsonData = JSON.parse(data);
                const newProduct = {id: jsonData.nextId, ...req.body};
                jsonData.products.push(newProduct);
                jsonData.nextId += 1;

                fs.writeFile(DB, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        handleError(res, 500, err.message);
                    }
                    else {
                        res.json(newProduct);
                    }
                })
            }
        });
    } catch (err) {
        handleError(res, 500, err.message);
    }
}

// DELETE existing product
async function removeProduct(req, res) {
    try {
        fs.readFile(DB, (err, data) => {
            if (err) {
                handleError(res, 500, err.message);
            } else {
                let jsonData = JSON.parse(data);
                const productToRemove = jsonData.products.find((product) => product.id == req.params.id);
                if (!productToRemove) {
                    handleError(res, 400, "Product ID not found");
                } else {
                    jsonData.products = jsonData.products.filter((product) => product.id != req.params.id);
                    if (jsonData.nextId === productToRemove.id + 1) jsonData.nextId -= 1;
    
                    fs.writeFile(DB, JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            handleError(res, 500, err.message);
                        }
                        else {
                            res.json(productToRemove);
                        }
                    })

                }

            }
        });
    } catch (err) {
        handleError(res, 500, err.message);
    }
}

// MODIFY existing product
async function editProduct(req, res) {
    try {
        fs.readFile(DB, (err, data) => {
            if (err) {
                handleError(res, 500, err.message);
            } else {
                let jsonData = JSON.parse(data);
                let index = jsonData.products.findIndex((product) => product.id == req.params.id);
                if (index == -1) {
                    handleError(res, 400, "Product ID not found");
                } else {
                    jsonData.products[index] = {...jsonData.products[index], ...req.body};
                    fs.writeFile(DB, JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            handleError(res, 500, err.message);
                        }
                        else {
                            res.json(req.body);
                        }
                    })

                }

            }
        });
    } catch (err) {
        handleError(res, 500, err.message);
    }
}

function handleError(res, status, message) {
    console.log(`ERROR ${status}: ${message}`);
    res.status(status).json({status: status, message: message});
}