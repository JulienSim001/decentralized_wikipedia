pragma solidity ^0.5.0;

contract Wikipedia {

  struct Article {
    string content;
  }
  
  uint[] public ids;
  mapping (uint => Article) public articlesById;

  constructor() public {
    uint index = 0;
    ids.push(index);

    Article memory newArticle = Article("This is your first article in your contract");
    articlesById[index] = newArticle;
  }

  function articleContent(uint index) public view returns (string memory) {
    return articlesById[index].content;
  }

  function getAllIds() public view returns (uint[] memory) {
    return ids;
  }

  // Write your code here.
  
  event ArticleAdded(
    address _from,
    string content
  );
  
  event ArticleUpdated(
    address _from,
    uint index,
    string content
  );
  
  function addArticle(string memory content) public returns (bool success) {
    address _from = msg.sender;
    uint index = ids.length;
    ids.push(index);
    emit ArticleAdded(_from, content);
  	
  	Article memory newArticle = Article(content);
  	articlesById[index] = newArticle;
  	
  	return true;
  }
  
  function updateArticle(uint index, string memory content) public returns (bool success) {
    address _from = msg.sender;
    emit ArticleUpdated(_from, index, content);
  	articlesById[index].content = content;
  	
  	return true;
  }
}
