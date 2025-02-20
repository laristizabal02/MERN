import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutation';

const SavedBooks = () => {
  // Execute the `QUERY_ME` query for the logged in user's information
  const { data } = useQuery(QUERY_ME);
  console.log('this is the data', data)

  // Execute the remove book mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log('thi is the book id for remove', bookId)
    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId },
      });
      
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!data) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {data.me.username ? (
            <h1>Viewing {data.me.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${
              data.me.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data.me.savedBooks.map((book: any) => {
            return (
              <Col key={book.bookId} md='4'>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;