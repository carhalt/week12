// Function to upload photo
function uploadPhoto() {
    const input = document.getElementById('uploadInput');
    const file = input.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('photo', file);
        //preferably sooner then later, these are the big parts that are totally wrecking my project
        fetch('your-upload-endpoint', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Create a new Image and add it to the images list
            const newImage = new Image(data.name); 
            DOMManager.Images.push(newImage);
            DOMManager.render(DOMManager.Images);
        })

        //catches right here. maybe showing there is something wrong with upload photo class
        .catch(error => console.error('Error uploading photo:', error));
    }
}

// Image class
class Image {
    constructor(name) {
        this.name = name;
        this.Comments = [];
    }

    addComment(name) {
        this.Comments.push(new Comment(name));
    }
}

// Comment class
class Comment {
    constructor(name) {
        this.name = name;
    }
}

// ImageService class
class ImageService {
    // static url = 'https://mockapi.io/projects/65a33a1fa54d8e805ed37918#';

    static getAllImages() {
        return $.get(this.url);
    }

    static deleteImage(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// DOMManager class
class DOMManager {
    static Images;

    static getAllImages() {
        ImageService.getAllImages().then(Images => this.render(Images));
    }

    static deleteImage(id) {
        ImageService.deleteImage(id)
        .then(() => ImageService.getAllImages())
        .then(Images => this.render(Images));
    }

    static render(Images) {
        this.Images = Images;
        $('#app').empty();

        for (let Image of Images) {
            $('#app').prepend(
                `<div id="${Image._id}" class="card">
                    <div class="card-header">
                        <h2>${Image.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteImage('${Image._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${Image._id}-Comment-name" class="form-control" placeholder="Comment">      
                                </div>
                            </div>
                            <button id="${Image._id}-new-Comment" onclick="DOMManager.addComment('${Image._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );

            for (let Comment of Image.Comments) {
                $(`#${Image._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${Comment._id}"><strong>Name: </strong> ${Comment.name}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteComment('${Image._id}' , '${Comment._id}')">Delete Comment</button>`
                );
            }
        }
    }
}

// Click event for creating a new image
$('#create-new-Image').click(() => {
    uploadPhoto();
    $('#new-Image-name').val('');
});

// Get all images on page load
DOMManager.getAllImages();



