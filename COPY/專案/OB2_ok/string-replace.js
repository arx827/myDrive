const fs = require('fs')

const options = [
    { search: 'elliptic@6.5.4', replace:'elliptic_6.5.4'},
    { search: 'fedor@indutny.com', replace:'fedor_indutny.com'},
    { search: 'git@github.com', replace:'git_github.com'},
    { search: 'antd@2.0', replace:'antd_2.0'},
    { search: 'yiminghe@gmail.com', replace:'yiminghe_gmail.com'},
    { search: 'jeeeyul@gmail.com', replace:'jeeeyul_gmail.com'},
    { search: 'miodrag@restartit.me', replace:'miodrag_restartit.me'},
    { search: 'robbiecloset@gmail.com', replace:'robbiecloset_gmail.com'},
    { search: 'milanjanackovic@gmail.com', replace:'milanjanackovic_gmail.com'},
    { search: 'stefan@hotmail.rs', replace:'stefan_hotmail.rs'},
    { search: 'mail@nicolai.io', replace:'mail_nicolai.io'},
    { search: 'aa@bb.cc', replace:'aa_bb.cc'},
    { search: 'neuronet.io@gmail.com', replace:'neuronet.io_gmail.com'},
    { search: 'trash@rubaxa.org', replace:'trash_rubaxa.org'},
    { search: 'owen23355@gmail.com', replace:'owen23355_gmail.com'},
    { search: 'gender:', replace:'g_e_n_d_e_r:'},
]

function replaceString(file){
    try{
        let stringData = fs.readFileSync(`dist/js/${file}`).toString()
        options.forEach(op => {
            if (stringData.includes(op.search)){
                stringData = stringData.replaceAll(op.search, op.replace)
            }
        })
        return stringData
    } catch (err) {
        console.error('step2 error:', err);
        return null;
    }
}

const files = fs.readdirSync('dist/js')
files.forEach((file, index) =>{
    if(file.endsWith('.js')){
        const replacedString = replaceString(file)
        if (replacedString){
            fs.writeFile(`dist/js/${file}`, replacedString, function(err) {
                if (err){
                    return console.error('chunk-vendors 1 error:', err)
                }
            })
        }
    }
})