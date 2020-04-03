const express = require('express');

const server = express();

server.use(express.json());

let projetos = [];

function CheckProjectInArray(req, res, next) {
    const { id } = req.params;

    const validatedId = projetos.find(project => project.id == id);

    if(!validatedId){
        return res.status(400).json({ error: "Este projeto não existe"});
    }

    return next();
}

let count = 0;

server.use((req, res, next) => {
    count++;
    console.log(`Foram feitas ${count} requisições na aplicação`);
    return next();
})

server.post('/projetos', (req, res) => {
    const { id, title } = req.body;

    const formatedProject = { id, title, tasks: [] }

    projetos.push(formatedProject);

    return res.status(200).json({ message: "Projeto criado com sucesso!" })

})

server.get('/projetos', (req, res) => {
    return res.json(projetos);
});

server.put('/projetos/:id', CheckProjectInArray, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    if(projetos.length < 1) return res.status(400).json({ error: "Não existe projetos no array" });

    const validatedId = projetos.find(project => project.id == id);

    if(validatedId){
        validatedId.title = title;
        return res.status(400).json({ error: "Projeto editado com sucesso!" });
    } else {
        return res.status(400).json({ error: "Projeto não encontrado no array" });
    }    
})


server.delete('/projetos/:id', CheckProjectInArray, (req, res) => {
    const { id } = req.params; 

    if(projetos.length < 1) return res.status(400).json({ error: "Não existe projetos no array" });

    const indexValidated = projetos.findIndex(project => project.id == id);

    console.log(indexValidated);

    projetos.splice(indexValidated, 1);

    return res.status(400).json({ error: "Projeto deletado com sucesso!" });
})

server.post('/projetos/:id/tasks', CheckProjectInArray, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const validatedId = projetos.find(project => project.id == id);

    if(projetos.length < 1) return res.status(400).json({ error: "Não existe projetos no array" });

    if(validatedId){
        validatedId.tasks.push(title);
        return res.status(200).json({ message: `Tarefa adicionada com sucesso no projeto ${validatedId.title}`});
    }
})



server.listen(3000);