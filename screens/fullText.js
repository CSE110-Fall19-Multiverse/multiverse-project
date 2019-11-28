const fs = require('./firestore.js');
let post1 = {
    type: 'selling_posts',
    summary: 'I need a tutor to help me with this assignment, please.',
    description: '110 is hard.'
};
//generateKeywords(post1.summary, true);
//console.log(generateKeywords(post1.summary, true));
//console.log(createPostToAdd(post1));
// handleAddPost(post1);
searchWithMultipleKeyword(post1.type, ['tutor', 'need']).then(result => {
    console.log('Found the following results when searching for keywords:\n[\'tutor\', \'need\']');
    logResults(result);
}).catch(e => {
    console.log('There is an error when attempted to call logResults():');
    console.log(e);
});

searchWithMultipleKeyword(post1.type, ['tutor', 'no']).then(result => {
    console.log('Found the following results when searching for keywords:\n[\'tutor\', \'no\']');
    logResults(result);
}).catch(e => {
    console.log('There is an error when attempted to call logResults():');
    console.log(e);
});

function logResults(results) // this function should be removed, only for test purpose
{
    if(results.empty) 
    {
        return;
    }
    
    for(let doc of results.docs)
    {
        console.log('The document id is: ' + doc.id);
        console.log('The post description is: ' + doc.get('description'));
        //console.log('The post description is: ' + doc.getData());
    }
}

function createPostToAdd(post) 
{
    // flatten the post object
    let keywordsMapToAdd = generateKeywords(post.summary, true);
    console.log("hello");
    let postToAdd = {
        type: post.type,
        summary: post.summary,
        description: post.description,
        keywords: keywordsMapToAdd
    }
    return postToAdd; 
}

function handleAddPost(post) 
{
    // use createPostToAdd() to process the post first
    postToAdd = createPostToAdd(post);
    fs.collection(postToAdd.type)
        .add(postToAdd)
        .then(docRef => {
            // the id might came in handy later
            console.log(`Added a new ${postToAdd.type} with description: ${postToAdd.description}`)
            return { ...postToAdd, id: docRef.id };
        })
        .catch(e => {
            console.log('Error occured when adding a post.\n');
            console.log(e);
        });
}

async function searchWithMultipleKeyword(collection, keywords, cursorPos = null)
{
   let temp = [];
   for(let keyword of keywords)
   {
       temp.push(keyword.toLowerCase().replace(/[^\w\s]/gi, ''));
   } 

   // chain '==' queries in a loop to effectively obtain the intersection
   const ref = fs.collection(collection);
   let partialQueryResult = ref; // after the loop finish this will contain results
   for(let keyword of temp)
   {
        partialQueryResult = partialQueryResult.where(`keywords.${keyword}`, '==', true);
   } // type of partialQueryResult: Query

   // use get() which returns Promise<QuerySnapshot>
   let results = await partialQueryResult.get().catch(e => {
       console.log('Error thrown at get() in searchWithMultipleKeywords(): ');
       console.log(e);
   }); // now results should be a QuerySnapshot

   if(results.empty)
   {
       console.log('Did not find any results when searching for keywords:');
       console.log(keywords);
   }
   console.log('result is '+results);
   return results;
}
async function searchWithKeyword(type, keyword)
{
    // pre-process the keyword
    keyword = keyword.toLowerCase();
    keyword = keyword.replace(/[^\w\s]/gi, '');

    // use the array contains indexes to query for keywords
    const snapshot = await fs.collection(type) // type: CollectionReference
                       .where(`keywords.${keyword}`, '==', true) // type: Query
                       .get() //type: Promise<QuerySnapshot>
                       .catch(e => {
                           console.log('I catched this error!\n');
                           console.log(error);
                           return [];
                       }); // after this snapshot should resolve to QuerySnapshot

    if(snapshot.empty) // did not find any match
    {
        return [];
    }
    snapshot.forEach(doc => {
        console.log(doc.get('summary'));
    });

    return snapshot.docs; // type: QueryDocumentSnapshot[]
    /** 
    let results = snapshot.docs.reduce((acc, cur) => { 
        // for now, just return the doc to see what it is
        return acc.push(cur.get('summary'));
    }, []);
    let results = [];
    snapshot.forEach(doc => {
       results.push(doc.data()); 
    });
    console.log(results);
    return results;
    */
}

function generateKeywords(content, isPost) 
{
    // store lower case letters to enable case-insensitive search
    content = content.toLowerCase();
    // strip the string off with special characters
    content = content.replace(/[^\w\s]/gi, '');

    // split by space and keep those words
    let keywords = [content];
    if (isPost) 
    {
        keywords = content.split(' ');
    }
    let oldKeywords = keywords.slice();

    for(let word of oldKeywords) 
    {
        let temp = '';
        for(let char of word)
        {
            temp += char;
            keywords.push(temp);
        }
    }

    // create a map so we can use query chaining
    let keywordsMap = {};
    for(let keyword of keywords) {
        keywordsMap[keyword] = true;
    }
    console.log("finish");
    return keywordsMap;
}

const post = 'HeLLo, I WANT TO FInd A Cse8B TuTOR!';
//console.log(generateKeywords(post, true));
const username = 'AnUnobstrusiveUserName';
//console.log(generateKeywords(username, false))