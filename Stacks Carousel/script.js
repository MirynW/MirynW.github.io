//Cache dom
const image = document.querySelector( '.image' );
const i1 = document.querySelector( '.image-holder1' );
const i2 = document.querySelector( '.image-holder2' );
const i3 = document.querySelector( '.image-holder3' );
const i4 = document.querySelector( '.image-holder4' );
let arr = [i1, i2, i3, i4];

//Classes
class LinkedList {
    constructor() {
        this.first = null;
        this.current = null
        this.last = null;
        this.active = null;
    }
    append(product) {
        let node = new Node(product, null, null);
        if(this.first == null && this.current == null && this.last ==  null) {
            node.prev = node;
            node.next = node;
            this.first = node;
            this.current = node;
            this.last = node;
            this.active = node;
        } else {
            while(this.current.next.id != this.first.id)
                this.current = this.current.next;
            node.prev = this.last;
            this.current.next = node;
            this.last = node;
            node.next = this.first;
            this.first.prev = this.last;
        }
    }

}
class Node {
    constructor(product, next, prev) {
        this.product = product;
        this.next = next;
        this.prev = prev;
        this.id = product.id;
    }
}
class Product {
    constructor( url, link, title, content, id ) {
        this.url = url;
        this.link = link;
        this.title = title;
        this.content = content;
        this.id = id;
    }
}
//Data
let elements = new LinkedList();
function fillData() {
    let url;
    let link;
    let title;
    let content;
    let product;

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EBSCOhost_Logo_1.png';
    title = 'EBSCOhost Training';
    content = 'Select from live and recorded sessions covering EBSCOhost Basics, Advanced, and MyEBSCOhost Folders.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=eda7466fd703b38688ff2eac5b80ab6c';
    product = new Product( url, link, title, content, 0 );  
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EDS_Logo_Stacks2.png';
    title = 'EBSCO Discovery Service Training';
    content = 'Select from live and recorded sessions covering EDS: Introduction, Maintenance, Linking and much more!';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=6069512827e81652262de693cba3df46';
    product = new Product( url, link, title, content, 1 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EBSCO_eBooks.png';
    title = 'eBooks, Audiobooks, ECM & GOBI Training';
    content = 'Find all live and recorded sessions covering eBooks, Audiobooks, EBSCOhost Collection Manager (ECM), and GOBI.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=de8537bbc123fd8e5f0f63e9cdefa655';
    product = new Product( url, link, title, content, 2 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/fulltext_logo.png';
    title = 'Full Text Finder & HLM Training';
    content = 'Options include live and recorded training on FTF Basics, Holdings Management (HLM), Linking, Reports, and more.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=c611207051e0e3105c148d4074792b32';
    product = new Product( url, link, title, content, 3 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EBSCOadmin_Logo.png';
    title = 'EBSCOadmin';
    content = 'Select from live or recorded sessions covering EBSCOadmin, the administrator tool for your EBSCO resources. Options include a Basic overview or Reports & Statistics.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=b7e5454f0ff0432a5148934c9d28e0ad';
    product = new Product( url, link, title, content, 4 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EBSCOhealth_Logo.png';
    title = 'Medical Resources';
    content = 'Choose from a variety of training options covering CINAHL, Nursing Reference Center +, DynaMed, MEDLINE and much more.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=1e62a2ab6277f3691505a05edcd67fcb';
    product = new Product( url, link, title, content, 5 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/BusinessSource_Logo.png';
    title = 'Business Resources';
    content = 'Learn more about Business Source or the Business Searching Interface with available live and recorded sessions.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=f824297c58f2483606a571eef67f0142';
    product = new Product( url, link, title, content, 6 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/OA_Logo.png';
    title = 'OpenAthens';
    content = 'Select a convenient training session to learn more about OpenAthens Administration.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=7f7d3fbd16da7706fa8f880b1a5b0b58';
    product = new Product( url, link, title, content, 7 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/tool_logo.jpg';
    title = 'Additional Training';
    content = 'Check here to locate training opportunities for additional products, such as Explora, Curriculum Builder, NoveList, Rosetta Stone, etc.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=e6ab9670bb130da0b51150c7208af7cf';
    product = new Product( url, link, title, content, 8 );
    elements.append(product);


    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/LearningExpress_Logo.png';
    title = 'LearningExpress';
    content = 'Find a variety of classes covering LearningExpress Library, Job & Career Accelerator, PrepSTEP, and more.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=079b0f45b8f214e6aaf443aaf97e8a5a';
    product = new Product( url, link, title, content, 9 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/EBSCOnet_Logo.png';
    title = 'EBSCONET';
    content = 'Register for a brief EBSCONET: Basics class, a complete EBSCONET: Comprehensive overview, or select training for specific aspects of EBSCONET, including Claiming or Renewals.';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=9b7f8947d161789131d23529352d2855';
    product = new Product( url, link, title, content, 10 );
    elements.append(product);

    url = 'https://ebscotrain.stacksdiscovery.com/sites/default/files/office_logo.jpg';
    title = 'Usage Consolidation Training';
    content = 'Classes available include a Complete Overview or Using Your Data with Reports & Analytics';
    link = 'https://ebscotraining.webex.com/ebscotraining/cate.php?CATID=ccc896b0aed411c2798305bf8b5df2bd';
    product = new Product( url, link, title, content, 11 );
    elements.append(product);
}

//UserInput
function onClick( dir ) {
    //Shift each element to the right, in a doubly linked list?
    if( dir == '<' ) {
        elements.active = elements.active.prev;
    } else {
        elements.active = elements.active.next;
    }
    render();
}
//Render 4 elements
function render() {
    let currNode = elements.active;
    let currProduct = currNode.product;
    let imageTag;
    let texTag;
    let linkTag;
    for(let i=0; i<4; i++) {
        if(currNode != null) {
            imageTag = arr[i].querySelector( '.image' );
            texTag = arr[i].querySelector( '.text' );
            linkTag = arr[i].querySelector('.link');
            imageTag.style.background = `url('${currProduct.url}')`;
            imageTag.style.backgroundSize = 'contain';
            imageTag.style.backgroundRepeat = 'no-repeat';
            texTag.innerHTML = `<hr><span class="title">${currProduct.title}</span><br><p class="content">${currProduct.content}</p>`;
            linkTag.setAttribute("href", currProduct.link);
            currNode = currNode.next;
            currProduct = currNode.product;
        }
    }
}


//Function called on init
fillData();
render();